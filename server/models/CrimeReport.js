const mongoose = require('mongoose');

const crimeReportSchema = new mongoose.Schema(
  {
    complaintId: { type: String, required: true, unique: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true, trim: true },
    incidentDate: { type: String, required: true },
    incidentTime: { type: String, required: true },
    location: { type: String, required: true, trim: true },
    city: { type: String, trim: true },
    district: { type: String, trim: true },
    state: { type: String, trim: true },
    latitude: { type: Number },
    longitude: { type: Number },
    evidenceFiles: [{ type: String }],
    aiCategorySuggestion: {
      category: { type: String },
      confidence: { type: Number },
    },
    aiSummary: { type: String },
    status: {
      type: String,
      enum: ['Submitted', 'Under Review', 'Verified', 'Assigned', 'Under Investigation', 'Resolved', 'Rejected'],
      default: 'Submitted',
      index: true,
    },
    assignedOfficer: { type: mongoose.Schema.Types.ObjectId, ref: 'PoliceOfficer', default: null },
  },
  { timestamps: true }
);

crimeReportSchema.index({ createdAt: -1 });
crimeReportSchema.index({ district: 1, city: 1 });

module.exports = mongoose.model('CrimeReport', crimeReportSchema);
