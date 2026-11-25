const mongoose = require('mongoose');

const policeOfficerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    badgeNumber: { type: String, required: true, unique: true, trim: true },
    department: { type: String, required: true, trim: true },
    designation: { type: String, trim: true },
    assignedCases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CrimeReport' }],
    availabilityStatus: { type: String, enum: ['available', 'busy', 'off-duty'], default: 'available' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PoliceOfficer', policeOfficerSchema);
