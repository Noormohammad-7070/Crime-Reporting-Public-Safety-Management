const mongoose = require('mongoose');

const assignedCaseSchema = new mongoose.Schema(
  {
    complaintId: { type: String, required: true, index: true },
    officerId: { type: mongoose.Schema.Types.ObjectId, ref: 'PoliceOfficer', required: true, index: true },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedDate: { type: Date, default: Date.now },
    caseStatus: { type: String, default: 'Assigned' },
  },
  { timestamps: true }
);

assignedCaseSchema.index({ complaintId: 1, officerId: 1 }, { unique: true });

module.exports = mongoose.model('AssignedCase', assignedCaseSchema);
