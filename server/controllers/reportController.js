const axios = require('axios');
const { validationResult } = require('express-validator');
const CrimeReport = require('../models/CrimeReport');
const ComplaintStatus = require('../models/ComplaintStatus');
const User = require('../models/User');
const PoliceOfficer = require('../models/PoliceOfficer');
const AssignedCase = require('../models/AssignedCase');
const generateComplaintId = require('../utils/complaintId');
const logAudit = require('../utils/audit');
const createNotification = require('../utils/notify');

const AI_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

const CATEGORIES = ['Theft', 'Robbery', 'Cybercrime', 'Harassment', 'Assault', 'Missing Person', 'Fraud', 'Vandalism', 'Domestic Violence', 'Other'];

function normalizeCategory(text) {
  if (!text) return 'Other';
  const found = CATEGORIES.find((c) => c.toLowerCase() === String(text).toLowerCase());
  return found || 'Other';
}

function fallbackClassify(description = '') {
  const d = description.toLowerCase();
  const rules = [
    ['Cybercrime', ['online', 'hack', 'phish', 'scam', 'otp', 'internet', 'email', 'fraudulent website', 'upi']],
    ['Theft', ['stole', 'stolen', 'theft', 'pickpocket', 'snatched', 'bag', 'wallet', 'phone stolen']],
    ['Robbery', ['robbed', 'robbery', 'armed', 'gun', 'knife', 'looted']],
    ['Harassment', ['harass', 'stalk', 'abuse', 'threaten', 'bully']],
    ['Assault', ['assault', 'attack', 'hit', 'beat', 'injury', 'violence']],
    ['Missing Person', ['missing', 'not found', 'disappeared', 'lost person']],
    ['Fraud', ['fraud', 'cheat', 'forgery', 'fake', 'impersonat']],
    ['Vandalism', ['vandal', 'damage', 'graffiti', 'broken', 'destroyed property']],
    ['Domestic Violence', ['domestic', 'spouse', 'partner abuse', 'family violence', 'in-laws']],
  ];
  for (const [cat, keys] of rules) {
    if (keys.some((k) => d.includes(k))) return { category: cat, confidence: 0.72 };
  }
  return { category: 'Other', confidence: 0.5 };
}

function fallbackSummary(text = '') {
  const clean = String(text).replace(/\s+/g, ' ').trim();
  if (clean.length <= 180) return clean;
  return `${clean.slice(0, 177)}...`;
}

async function callAI(path, payload, fallback) {
  try {
    const res = await axios.post(`${AI_URL}${path}`, payload, { timeout: 4000 });
    return res.data;
  } catch (e) {
    return fallback();
  }
}

function statusHistoryEntry(complaintId, status, updatedBy, remarks) {
  return { complaintId, status, updatedBy, remarks };
}

exports.createReport = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: 'Validation failed', errors: errors.array() });

  const complaintId = await generateComplaintId();
  const files = (req.files || []).map((f) => `/uploads/${f.filename}`);
  const body = req.body;

  const aiSuggestion = await callAI('/api/classify', { description: body.description, category: body.category }, () => fallbackClassify(body.description));
  const aiSummary = await callAI('/api/summarize', { description: body.description, title: body.title }, () => ({ summary: fallbackSummary(body.description) }));
  let duplicateInfo = { possibleDuplicates: [] };
  try {
    const existing = await CrimeReport.find({}, 'complaintId title description incidentDate location city district category createdAt').sort({ createdAt: -1 }).limit(200).lean();
    duplicateInfo = await callAI('/api/duplicate-check', { report: { title: body.title, description: body.description, incidentDate: body.incidentDate, location: body.location, city: body.city, district: body.district, category: body.category }, existing }, () => ({ possibleDuplicates: [] }));
  } catch (_) {}

  const report = await CrimeReport.create({
    complaintId,
    userId: req.user._id,
    title: body.title,
    category: normalizeCategory(body.category),
    description: body.description,
    incidentDate: body.incidentDate,
    incidentTime: body.incidentTime,
    location: body.location,
    city: body.city,
    district: body.district,
    state: body.state,
    latitude: body.latitude !== undefined && body.latitude !== '' ? Number(body.latitude) : undefined,
    longitude: body.longitude !== undefined && body.longitude !== '' ? Number(body.longitude) : undefined,
    evidenceFiles: files,
    aiCategorySuggestion: aiSuggestion && aiSuggestion.category ? { category: aiSuggestion.category, confidence: aiSuggestion.confidence } : undefined,
    aiSummary: aiSummary?.summary || fallbackSummary(body.description),
    status: 'Submitted',
  });

  await ComplaintStatus.create(statusHistoryEntry(complaintId, 'Submitted', req.user._id, 'Complaint submitted by citizen'));
  await logAudit(req.user._id, 'CREATE_REPORT', 'CrimeReport', report._id);

  const admins = await User.find({ role: 'admin' }).select('_id').lean();
  await Promise.all(admins.map((a) => createNotification({
    userId: a._id,
    title: 'New Crime Report Submitted',
    message: `Complaint ${complaintId} (${report.category}) was submitted and needs review.`,
    type: 'report',
  })));

  res.status(201).json({
    message: 'Crime report submitted successfully',
    complaintId,
    report,
    duplicateWarning: duplicateInfo,
  });
};

exports.listReports = async (req, res) => {
  const { status, category, q } = req.query;
  const filter = {};
  if (req.user.role === 'citizen') filter.userId = req.user._id;
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (q) {
    filter.$or = [
      { complaintId: new RegExp(q, 'i') },
      { title: new RegExp(q, 'i') },
      { description: new RegExp(q, 'i') },
      { location: new RegExp(q, 'i') },
    ];
  }
  let query = CrimeReport.find(filter).sort({ createdAt: -1 });
  if (req.user.role !== 'citizen') {
    query = query.populate('userId', 'name email phone').populate({ path: 'assignedOfficer', populate: { path: 'userId', select: 'name email phone' } });
  }
  const reports = await query.lean();
  res.json(reports);
};

exports.myReports = async (req, res) => {
  const reports = await CrimeReport.find({ userId: req.user._id }).sort({ createdAt: -1 }).lean();
  res.json(reports);
};

exports.getReportById = async (req, res) => {
  const report = await CrimeReport.findById(req.params.id)
    .populate('userId', 'name email phone address')
    .populate({ path: 'assignedOfficer', populate: { path: 'userId', select: 'name email phone' } })
    .lean();
  if (!report) return res.status(404).json({ message: 'Report not found' });

  if (req.user.role === 'citizen' && String(report.userId?._id || report.userId) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  if (req.user.role === 'officer') {
    const officer = await PoliceOfficer.findOne({ userId: req.user._id }).lean();
    const assigned = officer && String(report.assignedOfficer?._id || report.assignedOfficer) === String(officer._id);
    if (!assigned) return res.status(403).json({ message: 'Access denied' });
  }

  const history = await ComplaintStatus.find({ complaintId: report.complaintId }).sort({ updatedAt: 1 }).populate('updatedBy', 'name role').lean();
  const notes = await require('../models/InvestigationNote').find({ complaintId: report.complaintId }).sort({ createdAt: -1 }).populate({ path: 'officerId', populate: { path: 'userId', select: 'name' } }).lean();
  res.json({ ...report, statusHistory: history, investigationNotes: notes });
};

exports.trackByComplaintId = async (req, res) => {
  const report = await CrimeReport.findOne({ complaintId: req.params.complaintId })
    .populate({ path: 'assignedOfficer', populate: { path: 'userId', select: 'name' } })
    .lean();
  if (!report) return res.status(404).json({ message: 'Complaint not found' });

  const history = await ComplaintStatus.find({ complaintId: report.complaintId }).sort({ updatedAt: 1 }).lean();
  const isOwner = req.user && String(report.userId) === String(req.user._id);
  const isPrivileged = req.user && ['admin', 'officer'].includes(req.user.role);

  const base = {
    complaintId: report.complaintId,
    title: report.title,
    category: report.category,
    status: report.status,
    incidentDate: report.incidentDate,
    incidentTime: report.incidentTime,
    location: report.location,
    city: report.city,
    district: report.district,
    state: report.state,
    createdAt: report.createdAt,
    updatedAt: report.updatedAt,
    assignedOfficer: report.assignedOfficer ? { name: report.assignedOfficer.userId?.name, badgeNumber: report.assignedOfficer.badgeNumber } : null,
    statusHistory: history,
  };
  if (isOwner || isPrivileged) {
    base.description = report.description;
    base.evidenceFiles = report.evidenceFiles;
    base.aiSummary = report.aiSummary;
  }
  res.json(base);
};

exports.updateStatus = async (req, res) => {
  const { status, remarks } = req.body;
  const allowed = ['Submitted', 'Under Review', 'Verified', 'Assigned', 'Under Investigation', 'Resolved', 'Rejected'];
  if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });

  const report = await CrimeReport.findById(req.params.id);
  if (!report) return res.status(404).json({ message: 'Report not found' });

  if (req.user.role === 'officer') {
    const officer = await PoliceOfficer.findOne({ userId: req.user._id });
    if (!officer || String(report.assignedOfficer) !== String(officer._id)) {
      return res.status(403).json({ message: 'You can only update your assigned cases' });
    }
  }

  report.status = status;
  await report.save();
  await ComplaintStatus.create(statusHistoryEntry(report.complaintId, status, req.user._id, remarks || ''));
  await logAudit(req.user._id, 'UPDATE_REPORT_STATUS', 'CrimeReport', report._id);

  await createNotification({
    userId: report.userId,
    title: 'Complaint Status Updated',
    message: `Your complaint ${report.complaintId} status is now: ${status}.`,
    type: 'status',
  });

  res.json({ message: 'Status updated', report });
};

exports.deleteReport = async (req, res) => {
  const report = await CrimeReport.findById(req.params.id);
  if (!report) return res.status(404).json({ message: 'Report not found' });
  await ComplaintStatus.deleteMany({ complaintId: report.complaintId });
  await AssignedCase.deleteMany({ complaintId: report.complaintId });
  await report.deleteOne();
  await logAudit(req.user._id, 'DELETE_REPORT', 'CrimeReport', req.params.id);
  res.json({ message: 'Report deleted' });
};
