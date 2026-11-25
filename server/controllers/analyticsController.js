const CrimeReport = require('../models/CrimeReport');

exports.monthly = async (req, res) => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  const data = await CrimeReport.aggregate([
    { $match: { createdAt: { $gte: start } } },
    { $group: { _id: { y: { $year: '$createdAt' }, m: { $month: '$createdAt' } }, count: { $sum: 1 } } },
    { $sort: { '_id.y': 1, '_id.m': 1 } },
  ]);
  const labels = [];
  const counts = [];
  for (let i = 0; i < 12; i += 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
    labels.push(d.toLocaleString('default', { month: 'short', year: '2-digit' }));
    const found = data.find((x) => x._id.y === d.getFullYear() && x._id.m === d.getMonth() + 1);
    counts.push(found ? found.count : 0);
  }
  res.json({ labels, counts });
};

exports.categories = async (req, res) => {
  const data = await CrimeReport.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  res.json({ labels: data.map((d) => d._id || 'Unknown'), counts: data.map((d) => d.count) });
};

exports.status = async (req, res) => {
  const statuses = ['Submitted', 'Under Review', 'Verified', 'Assigned', 'Under Investigation', 'Resolved', 'Rejected'];
  const data = await CrimeReport.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
  const map = Object.fromEntries(data.map((d) => [d._id, d.count]));
  res.json({ labels: statuses, counts: statuses.map((s) => map[s] || 0) });
};

exports.weekly = async (req, res) => {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - 6);
  start.setHours(0, 0, 0, 0);
  const data = await CrimeReport.aggregate([
    { $match: { createdAt: { $gte: start } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
  const labels = [];
  const counts = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    labels.push(d.toLocaleDateString(undefined, { weekday: 'short' }));
    const found = data.find((x) => x._id === key);
    counts.push(found ? found.count : 0);
  }
  res.json({ labels, counts });
};

exports.hotspots = async (req, res) => {
  const reports = await CrimeReport.find(
    { latitude: { $ne: null }, longitude: { $ne: null } },
    'complaintId title category status latitude longitude city district state createdAt incidentDate location'
  ).sort({ createdAt: -1 }).limit(500).lean();
  res.json(reports);
};
