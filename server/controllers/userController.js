const bcrypt = require('bcryptjs');
const User = require('../models/User');
const logAudit = require('../utils/audit');

exports.listCitizens = async (req, res) => {
  const citizens = await User.find({ role: 'citizen' }).select('-password').sort({ createdAt: -1 }).lean();
  res.json(citizens.map((u) => ({ ...u, id: u._id })));
};

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password').lean();
  res.json({ ...user, id: user._id });
};

exports.updateProfile = async (req, res) => {
  const { name, phone, address, password } = req.body;
  const updates = {};
  if (name) updates.name = name;
  if (phone !== undefined) updates.phone = phone;
  if (address !== undefined) updates.address = address;
  if (password) {
    if (String(password).length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
    updates.password = await bcrypt.hash(password, 10);
  }
  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password').lean();
  await logAudit(req.user._id, 'UPDATE_PROFILE', 'User', req.user._id);
  res.json({ ...user, id: user._id });
};

exports.deleteCitizen = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, role: 'citizen' });
  if (!user) return res.status(404).json({ message: 'Citizen not found' });
  await user.deleteOne();
  await logAudit(req.user._id, 'DELETE_CITIZEN', 'User', req.params.id);
  res.json({ message: 'Citizen deleted' });
};
