const bcrypt = require('bcryptjs');
const User = require('../models/User');
const PoliceOfficer = require('../models/PoliceOfficer');
const logAudit = require('../utils/audit');

exports.listOfficers = async (req, res) => {
  const officers = await PoliceOfficer.find()
    .populate('userId', 'name email phone role address createdAt')
    .sort({ createdAt: -1 })
    .lean();
  res.json(officers);
};

exports.getOfficer = async (req, res) => {
  const officer = await PoliceOfficer.findById(req.params.id).populate('userId', 'name email phone role address').lean();
  if (!officer) return res.status(404).json({ message: 'Officer not found' });
  res.json(officer);
};

exports.createOfficer = async (req, res) => {
  const { name, email, phone, password, address, badgeNumber, department, designation, availabilityStatus } = req.body;
  if (!name || !email || !password || !badgeNumber || !department) {
    return res.status(400).json({ message: 'name, email, password, badgeNumber, and department are required' });
  }
  const normalizedEmail = String(email).toLowerCase().trim();
  const exists = await User.findOne({ email: normalizedEmail });
  if (exists) return res.status(400).json({ message: 'Email already registered' });
  const badgeExists = await PoliceOfficer.findOne({ badgeNumber });
  if (badgeExists) return res.status(400).json({ message: 'Badge number already exists' });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email: normalizedEmail, phone, password: hashed, role: 'officer', address });
  const officer = await PoliceOfficer.create({
    userId: user._id,
    badgeNumber,
    department,
    designation,
    availabilityStatus: availabilityStatus || 'available',
  });
  await logAudit(req.user._id, 'CREATE_OFFICER', 'PoliceOfficer', officer._id);
  const populated = await PoliceOfficer.findById(officer._id).populate('userId', 'name email phone role address').lean();
  res.status(201).json(populated);
};

exports.updateOfficer = async (req, res) => {
  const officer = await PoliceOfficer.findById(req.params.id);
  if (!officer) return res.status(404).json({ message: 'Officer not found' });
  const { name, email, phone, address, badgeNumber, department, designation, availabilityStatus, password } = req.body;

  if (badgeNumber && badgeNumber !== officer.badgeNumber) {
    const exists = await PoliceOfficer.findOne({ badgeNumber, _id: { $ne: officer._id } });
    if (exists) return res.status(400).json({ message: 'Badge number already exists' });
    officer.badgeNumber = badgeNumber;
  }
  if (department) officer.department = department;
  if (designation !== undefined) officer.designation = designation;
  if (availabilityStatus) officer.availabilityStatus = availabilityStatus;
  await officer.save();

  const user = await User.findById(officer.userId);
  if (user) {
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (email) {
      const normalized = String(email).toLowerCase().trim();
      const emailExists = await User.findOne({ email: normalized, _id: { $ne: user._id } });
      if (emailExists) return res.status(400).json({ message: 'Email already in use' });
      user.email = normalized;
    }
    if (password) user.password = await bcrypt.hash(password, 10);
    await user.save();
  }

  await logAudit(req.user._id, 'UPDATE_OFFICER', 'PoliceOfficer', officer._id);
  const populated = await PoliceOfficer.findById(officer._id).populate('userId', 'name email phone role address').lean();
  res.json(populated);
};
