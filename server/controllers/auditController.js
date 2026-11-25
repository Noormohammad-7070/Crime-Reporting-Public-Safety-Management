const AuditLog = require('../models/AuditLog');

exports.list = async (req, res) => {
  const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(200).populate('userId', 'name email role').lean();
  res.json(logs);
};
