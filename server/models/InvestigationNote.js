const mongoose = require('mongoose');

const investigationNoteSchema = new mongoose.Schema(
  {
    complaintId: { type: String, required: true, index: true },
    officerId: { type: mongoose.Schema.Types.ObjectId, ref: 'PoliceOfficer', required: true },
    notes: { type: String, required: true, trim: true },
    attachments: [{ type: String }],
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } }
);

module.exports = mongoose.model('InvestigationNote', investigationNoteSchema);
