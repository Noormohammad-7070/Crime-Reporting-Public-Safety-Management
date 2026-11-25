const CrimeReport = require('../models/CrimeReport');
const PoliceOfficer = require('../models/PoliceOfficer');
const AssignedCase = require('../models/AssignedCase');
const InvestigationNote = require('../models/InvestigationNote');
const ComplaintStatus = require('../models/ComplaintStatus');
const logAudit = require('../utils/audit');
const createNotification = require('../utils/notify');

exports.assignCase = async (req, res) => {
  const { complaintId, officerId, remarks } = req.body;
  if (!complaintId || !officerId) return res.status(400).json({ message: 'complaintId and officerId are required' });

  const report = await CrimeReport.findOne({ complaintId });
  if (!report) return res.status(404).json({ message: 'Complaint not found' });
  const officer = await PoliceOfficer.findById(officerId).populate('userId', 'name');
  if (!officer) return res.status(404).json({ message: 'Officer not found' });

  report.assignedOfficer = officer._id;
  if (['Submitted', 'Under Review', 'Verified'].includes(report.status)) {
    report.status = 'Assigned';
  }
  await report.save();

  await AssignedCase.findOneAndUpdate(
    { complaintId, officerId: officer._id },
    { complaintId, officerId: officer._id, adminId: req.user._id, assignedDate: new Date(), caseStatus: report.status },
    { upsert: true, new: true }
  );

  if (!officer.assignedCases.map(String).includes(String(report._id))) {
    officer.assignedCases.push(report._id);
    await officer.save();
  }

  await ComplaintStatus.create({ complaintId, status: 'Assigned', updatedBy: req.user._id, remarks: remarks || `Assigned to officer ${officer.userId?.name || officer.badgeNumber}` });
  await logAudit(req.user._id, 'ASSIGN_CASE', 'CrimeReport', report._id);

  await createNotification({ userId: report.userId, title: 'Case Assigned', message: `Your complaint ${complaintId} has been assigned to an officer.`, type: 'case' });
  if (officer.userId?._id || officer.userId) {
    await createNotification({ userId: officer.userId._id || officer.userId, title: 'New Case Assigned', message: `You have been assigned complaint ${complaintId}.`, type: 'case' });
  }

  const updated = await CrimeReport.findById(report._id).populate({ path: 'assignedOfficer', populate: { path: 'userId', select: 'name email' } }).lean();
  res.json({ message: 'Case assigned successfully', report: updated });
};

exports.getAssignedCases = async (req, res) => {
  if (req.user.role === 'officer') {
    const officer = await PoliceOfficer.findOne({ userId: req.user._id });
    if (!officer) return res.status(404).json({ message: 'Officer profile not found' });
    const reports = await CrimeReport.find({ assignedOfficer: officer._id }).sort({ updatedAt: -1 }).populate('userId', 'name email phone').lean();
    return res.json(reports);
  }
  if (req.user.role === 'admin') {
    const cases = await AssignedCase.find().sort({ assignedDate: -1 }).populate({ path: 'officerId', populate: { path: 'userId', select: 'name email' } }).lean();
    return res.json(cases);
  }
  return res.status(403).json({ message: 'Forbidden' });
};

exports.updateCase = async (req, res) => {
  const { status, remarks, progressNote } = req.body;
  const allowed = ['Assigned', 'Under Investigation', 'Resolved', 'Rejected', 'Verified', 'Under Review'];
  const caseDoc = await AssignedCase.findById(req.params.id) || await AssignedCase.findOne({ complaintId: req.params.id });
  let report;
  if (caseDoc) {
    report = await CrimeReport.findOne({ complaintId: caseDoc.complaintId });
  } else {
    report = await CrimeReport.findById(req.params.id) || await CrimeReport.findOne({ complaintId: req.params.id });
  }
  if (!report) return res.status(404).json({ message: 'Case/report not found' });

  if (req.user.role === 'officer') {
    const officer = await PoliceOfficer.findOne({ userId: req.user._id });
    if (!officer || String(report.assignedOfficer) !== String(officer._id)) {
      return res.status(403).json({ message: 'Not your assigned case' });
    }
    if (progressNote) {
      await InvestigationNote.create({ complaintId: report.complaintId, officerId: officer._id, notes: progressNote, attachments: [] });
    }
  }

  if (status) {
    if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });
    report.status = status;
    await report.save();
    await ComplaintStatus.create({ complaintId: report.complaintId, status, updatedBy: req.user._id, remarks: remarks || progressNote || 'Case updated' });
    if (caseDoc) { caseDoc.caseStatus = status; await caseDoc.save(); }
    await createNotification({ userId: report.userId, title: 'Investigation Update', message: `Complaint ${report.complaintId} updated: ${status}.`, type: 'case' });
  }
  await logAudit(req.user._id, 'UPDATE_CASE', 'CrimeReport', report._id);
  res.json({ message: 'Case updated', report });
};

exports.addNote = async (req, res) => {
  const { notes } = req.body;
  if (!notes || !String(notes).trim()) return res.status(400).json({ message: 'Notes are required' });
  const officer = await PoliceOfficer.findOne({ userId: req.user._id });
  if (!officer) return res.status(403).json({ message: 'Officer profile not found' });

  const report = await CrimeReport.findById(req.params.id) || await CrimeReport.findOne({ complaintId: req.params.id });
  if (!report) return res.status(404).json({ message: 'Report/case not found' });
  if (req.user.role === 'officer' && String(report.assignedOfficer) !== String(officer._id)) {
    return res.status(403).json({ message: 'Not your assigned case' });
  }

  const attachments = (req.files || []).map((f) => `/uploads/${f.filename}`);
  const note = await InvestigationNote.create({ complaintId: report.complaintId, officerId: officer._id, notes, attachments });
  await logAudit(req.user._id, 'ADD_INVESTIGATION_NOTE', 'InvestigationNote', note._id);
  res.status(201).json(note);
};
