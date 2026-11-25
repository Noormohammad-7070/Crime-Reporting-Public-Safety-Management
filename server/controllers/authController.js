const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const PoliceOfficer = require('../models/PoliceOfficer');
const generateToken = require('../utils/generateToken');
const logAudit = require('../utils/audit');

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: 'Validation failed', errors: errors.array() });

  const { name, email, phone, password, address, role } = req.body;
  const normalizedEmail = String(email).toLowerCase().trim();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) return res.status(400).json({ message: 'Email already registered' });

  const safeRole = role === 'citizen' ? 'citizen' : 'citizen'; // public registration is citizen-only
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email: normalizedEmail, phone, password: hashed, role: safeRole, address });

  await logAudit(user._id, 'REGISTER', 'User', user._id);
  const token = generateToken(user._id, user.role);
  res.status(201).json({
    token,
    user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, address: user.address },
  });
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: 'Validation failed', errors: errors.array() });

  const { email, password, role } = req.body;
  const user = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  if (role && user.role !== role) {
    return res.status(403).json({ message: `This account is not authorized for ${role} login` });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });

  let officerProfile = null;
  if (user.role === 'officer') {
    officerProfile = await PoliceOfficer.findOne({ userId: user._id }).lean();
  }

  await logAudit(user._id, 'LOGIN', 'User', user._id);
  const token = generateToken(user._id, user.role);
  res.json({
    token,
    user: {
      id: user._id, name: user.name, email: user.email, phone: user.phone,
      role: user.role, address: user.address, officerProfile,
    },
  });
};

exports.logout = async (req, res) => {
  if (req.user) await logAudit(req.user._id, 'LOGOUT', 'User', req.user._id);
  res.json({ message: 'Logged out successfully' });
};

exports.me = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password').lean();
  let officerProfile = null;
  if (user && user.role === 'officer') {
    officerProfile = await PoliceOfficer.findOne({ userId: user._id }).lean();
  }
  res.json({ user: { ...user, id: user._id, officerProfile } });
};
