const CrimeReport = require('../models/CrimeReport');
const User = require('../models/User');
const PoliceOfficer = require('../models/PoliceOfficer');

exports.adminDashboard = async (req, res) => {
  const [total, pending, verified, underInvestigation, resolved, rejected, submitted, assigned, recent, officers, citizens] = await Promise.all([
    CrimeReport.countDocuments(),
    CrimeReport.countDocuments({ status: { $in: ['Submitted', 'Under Review'] } }),
    CrimeReport.countDocuments({ status: 'Verified' }),
    CrimeReport.countDocuments({ status: 'Under Investigation' }),
    CrimeReport.countDocuments({ status: 'Resolved' }),
    CrimeReport.countDocuments({ status: 'Rejected' }),
    CrimeReport.countDocuments({ status: 'Submitted' }),
    CrimeReport.countDocuments({ status: 'Assigned' }),
    CrimeReport.find().sort({ createdAt: -1 }).limit(8).populate('userId', 'name').lean(),
    User.countDocuments({ role: 'officer' }),
    User.countDocuments({ role: 'citizen' }),
  ]);
  res.json({
    cards: {
      totalComplaints: total,
      pendingComplaints: pending,
      verifiedComplaints: verified,
      underInvestigation,
      resolvedCases: resolved,
      rejectedComplaints: rejected,
      submittedComplaints: submitted,
      assignedComplaints: assigned,
      totalOfficers: officers,
      totalCitizens: citizens,
    },
    recentReports: recent,
  });
};

exports.citizenDashboard = async (req, res) => {
  const userId = req.user._id;
  const [total, pending, underInvestigation, resolved, recent] = await Promise.all([
    CrimeReport.countDocuments({ userId }),
    CrimeReport.countDocuments({ userId, status: { $in: ['Submitted', 'Under Review', 'Verified', 'Assigned'] } }),
    CrimeReport.countDocuments({ userId, status: 'Under Investigation' }),
    CrimeReport.countDocuments({ userId, status: 'Resolved' }),
    CrimeReport.find({ userId }).sort({ createdAt: -1 }).limit(5).lean(),
  ]);
  res.json({
    cards: { totalComplaints: total, pendingComplaints: pending, underInvestigation, resolvedCases: resolved },
    recentReports: recent,
  });
};

exports.officerDashboard = async (req, res) => {
  const officer = await PoliceOfficer.findOne({ userId: req.user._id });
  if (!officer) return res.status(404).json({ message: 'Officer profile not found' });
  const [assigned, underInvestigation, resolved, recent] = await Promise.all([
    CrimeReport.countDocuments({ assignedOfficer: officer._id }),
    CrimeReport.countDocuments({ assignedOfficer: officer._id, status: 'Under Investigation' }),
    CrimeReport.countDocuments({ assignedOfficer: officer._id, status: 'Resolved' }),
    CrimeReport.find({ assignedOfficer: officer._id }).sort({ updatedAt: -1 }).limit(6).populate('userId', 'name').lean(),
  ]);
  res.json({
    cards: { assignedCases: assigned, underInvestigation, resolvedCases: resolved, totalComplaints: assigned },
    recentReports: recent,
  });
};
