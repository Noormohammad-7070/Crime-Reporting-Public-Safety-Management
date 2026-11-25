const CrimeReport = require('../models/CrimeReport');

async function generateComplaintId() {
  const year = new Date().getFullYear();
  for (let i = 0; i < 5; i += 1) {
    const rand = Math.floor(100000 + Math.random() * 900000);
    const id = `CT-${year}-${rand}`;
    // eslint-disable-next-line no-await-in-loop
    const exists = await CrimeReport.findOne({ complaintId: id }).lean();
    if (!exists) return id;
  }
  return `CT-${year}-${Date.now()}`;
}

module.exports = generateComplaintId;
