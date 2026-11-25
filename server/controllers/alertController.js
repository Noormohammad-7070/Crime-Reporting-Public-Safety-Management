const PublicSafetyAlert = require('../models/PublicSafetyAlert');
const logAudit = require('../utils/audit');

exports.list = async (req, res) => {
  const alerts = await PublicSafetyAlert.find().sort({ createdAt: -1 }).populate('publishedBy', 'name role').lean();
  res.json(alerts);
};

exports.create = async (req, res) => {
  const { title, description, location, severity } = req.body;
  if (!title || !description) return res.status(400).json({ message: 'title and description are required' });
  const alert = await PublicSafetyAlert.create({ title, description, location, severity, publishedBy: req.user._id });
  await logAudit(req.user._id, 'CREATE_ALERT', 'PublicSafetyAlert', alert._id);
  res.status(201).json(alert);
};

exports.remove = async (req, res) => {
  const alert = await PublicSafetyAlert.findById(req.params.id);
  if (!alert) return res.status(404).json({ message: 'Alert not found' });
  await alert.deleteOne();
  await logAudit(req.user._id, 'DELETE_ALERT', 'PublicSafetyAlert', req.params.id);
  res.json({ message: 'Alert deleted' });
};
