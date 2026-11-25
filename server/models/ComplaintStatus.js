const mongoose = require('mongoose');

const complaintStatusSchema = new mongoose.Schema(
  {
    complaintId: { type: String, required: true, index: true },
    status: { type: String, required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    remarks: { type: String, trim: true },
  },
  { timestamps: { createdAt: false, updatedAt: 'updatedAt' } }
);

module.exports = mongoose.model('ComplaintStatus', complaintStatusSchema);
