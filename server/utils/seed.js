const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');
const PoliceOfficer = require('../models/PoliceOfficer');
const CrimeReport = require('../models/CrimeReport');
const ComplaintStatus = require('../models/ComplaintStatus');
const AssignedCase = require('../models/AssignedCase');
const InvestigationNote = require('../models/InvestigationNote');
const Notification = require('../models/Notification');
const PublicSafetyAlert = require('../models/PublicSafetyAlert');
const AuditLog = require('../models/AuditLog');

const now = new Date();
const daysAgo = (n) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000);
const fmtDate = (d) => d.toISOString().slice(0, 10);

async function run() {
  await connectDB();
  console.log('Seeding CrimeTrack AI demo data (fictional)...');

  const demoEmails = [
    'admin@crimetrack.demo', 'officer1@crimetrack.demo', 'officer2@crimetrack.demo', 'officer3@crimetrack.demo',
    'citizen1@crimetrack.demo', 'citizen2@crimetrack.demo', 'citizen3@crimetrack.demo', 'citizen4@crimetrack.demo', 'citizen5@crimetrack.demo',
    'noor@crimetrack.demo'
  ];
  const demoComplaintIds = Array.from({ length: 30 }, (_, i) => `CT-DEMO-${String(i + 1).padStart(4, '0')}`);

  await Promise.all([
    Notification.deleteMany({}),
    AuditLog.deleteMany({}),
    InvestigationNote.deleteMany({ complaintId: { $in: demoComplaintIds } }),
    AssignedCase.deleteMany({ complaintId: { $in: demoComplaintIds } }),
    ComplaintStatus.deleteMany({ complaintId: { $in: demoComplaintIds } }),
    CrimeReport.deleteMany({ complaintId: { $in: demoComplaintIds } }),
    PublicSafetyAlert.deleteMany({ title: /Fictional Demo/i }),
  ]);

  const demoUsers = await User.find({ email: { $in: demoEmails } }).select('_id role');
  const demoUserIds = demoUsers.map((u) => u._id);
  if (demoUserIds.length) {
    await PoliceOfficer.deleteMany({ userId: { $in: demoUserIds } });
    await User.deleteMany({ _id: { $in: demoUserIds } });
  }

  const hash = await bcrypt.hash('Password@123', 10);

  const admin = await User.create({ name: 'Demo Admin', email: 'admin@crimetrack.demo', phone: '9000000001', password: hash, role: 'admin', address: 'Central Command Office (Fictional)' });
  const officerUsers = await User.insertMany([
    { name: 'Officer Riya Sen', email: 'officer1@crimetrack.demo', phone: '9000000011', password: hash, role: 'officer', address: 'North Precinct (Fictional)' },
    { name: 'Officer Arjun Mehta', email: 'officer2@crimetrack.demo', phone: '9000000012', password: hash, role: 'officer', address: 'East Precinct (Fictional)' },
    { name: 'Officer Kavya Rao', email: 'officer3@crimetrack.demo', phone: '9000000013', password: hash, role: 'officer', address: 'South Precinct (Fictional)' },
  ]);
  const citizens = await User.insertMany([
    { name: 'Aanya Sharma', email: 'citizen1@crimetrack.demo', phone: '9000000021', password: hash, role: 'citizen', address: 'Maple Street, Demo City' },
    { name: 'Rahul Verma', email: 'citizen2@crimetrack.demo', phone: '9000000022', password: hash, role: 'citizen', address: 'Lake View, Demo City' },
    { name: 'Neha Iyer', email: 'citizen3@crimetrack.demo', phone: '9000000023', password: hash, role: 'citizen', address: 'Hill Road, Demo City' },
    { name: 'Imran Khan', email: 'citizen4@crimetrack.demo', phone: '9000000024', password: hash, role: 'citizen', address: 'River Side, Demo City' },
    { name: 'Sara Joseph', email: 'citizen5@crimetrack.demo', phone: '9000000025', password: hash, role: 'citizen', address: 'Green Park, Demo City' },
    { name: 'Noor Mohammad', email: 'noor@crimetrack.demo', phone: '9000000026', password: hash, role: 'citizen', address: 'Sunrise Avenue, Demo City' },
  ]);

  const officers = await PoliceOfficer.insertMany([
    { userId: officerUsers[0]._id, badgeNumber: 'DEM-1001', department: 'Cyber Crime Unit', designation: 'Inspector', availabilityStatus: 'available', assignedCases: [] },
    { userId: officerUsers[1]._id, badgeNumber: 'DEM-1002', department: 'Patrol Division', designation: 'Sub-Inspector', availabilityStatus: 'busy', assignedCases: [] },
    { userId: officerUsers[2]._id, badgeNumber: 'DEM-1003', department: 'Investigation Bureau', designation: 'Inspector', availabilityStatus: 'available', assignedCases: [] },
  ]);

  const reportDefs = [
    { i: 1, u: 0, title: 'Mobile phone stolen at bus stop', category: 'Theft', desc: 'A mobile phone was stolen from a bag at the central bus stop during evening rush. The device was last seen near the ticket counter and the complainant noticed it missing after boarding. (Fictional demo report)', status: 'Resolved', loc: 'Central Bus Stop', city: 'Demo City', district: 'Central', state: 'Demo State', lat: 12.9716, lng: 77.5946, days: 20, officer: 1 },
    { i: 2, u: 1, title: 'Online banking phishing attempt', category: 'Cybercrime', desc: 'Received a phishing email claiming to be from a bank asking for OTP and login details. Links redirected to a suspicious website; no money lost and credentials were not shared. (Fictional demo report)', status: 'Under Investigation', loc: 'Lake View Apartments', city: 'Demo City', district: 'North', state: 'Demo State', lat: 12.9810, lng: 77.6050, days: 3, officer: 0 },
    { i: 3, u: 2, title: 'Street harassment near market', category: 'Harassment', desc: 'Reported repeated verbal harassment near the evening market area over multiple days. Complainant requested increased patrol presence and follow-up from local officers. (Fictional demo report)', status: 'Assigned', loc: 'Old Market Road', city: 'Demo City', district: 'East', state: 'Demo State', lat: 12.9650, lng: 77.6100, days: 5, officer: 1 },
    { i: 4, u: 3, title: 'Wallet snatched by bike rider', category: 'Robbery', desc: 'Two individuals on a bike snatched a wallet near the river bridge and fled toward the service road. The wallet contained ID cards and cash. (Fictional demo report)', status: 'Verified', loc: 'River Bridge', city: 'Demo City', district: 'South', state: 'Demo State', lat: 12.9600, lng: 77.5800, days: 7, officer: null },
    { i: 5, u: 4, title: 'Fraudulent online shopping site', category: 'Fraud', desc: 'Payment made on a fake shopping website; product never delivered and seller unreachable. Transaction screenshots and website link details were noted by the complainant. (Fictional demo report)', status: 'Under Review', loc: 'Green Park Residence', city: 'Demo City', district: 'West', state: 'Demo State', lat: 12.9750, lng: 77.5700, days: 1, officer: null },
    { i: 6, u: 0, title: 'Park wall vandalized with graffiti', category: 'Vandalism', desc: 'Public park wall found vandalized overnight with spray paint. Maintenance staff reported the damage in the morning and requested cleanup and patrol monitoring. (Fictional demo report)', status: 'Resolved', loc: 'City Park', city: 'Demo City', district: 'Central', state: 'Demo State', lat: 12.9725, lng: 77.5900, days: 30, officer: 2 },
    { i: 7, u: 1, title: 'Missing elderly neighbor', category: 'Missing Person', desc: 'Elderly neighbor not seen since morning; family concerned and searching nearby areas. Last known location was near Lake View Colony market. (Fictional demo report)', status: 'Under Investigation', loc: 'Lake View Colony', city: 'Demo City', district: 'North', state: 'Demo State', lat: 12.9820, lng: 77.6030, days: 2, officer: 2 },
    { i: 8, u: 2, title: 'Minor assault during argument', category: 'Assault', desc: 'A verbal argument escalated into a minor physical altercation near a tea stall. Bystanders intervened and the injured person received basic first aid. (Fictional demo report)', status: 'Assigned', loc: 'Station Road', city: 'Demo City', district: 'East', state: 'Demo State', lat: 12.9680, lng: 77.6150, days: 4, officer: 1 },
    { i: 9, u: 3, title: 'Domestic disturbance reported', category: 'Domestic Violence', desc: 'Loud disturbance and possible domestic conflict reported by a neighbor. Welfare check requested and situation details provided for follow-up. (Fictional demo report)', status: 'Submitted', loc: 'River Side Block C', city: 'Demo City', district: 'South', state: 'Demo State', lat: 12.9585, lng: 77.5820, days: 0, officer: null },
    { i: 10, u: 4, title: 'Bicycle stolen from apartment parking', category: 'Theft', desc: 'Bicycle missing from apartment parking area overnight; CCTV may be available at the gate. Complaint reviewed and closed as rejected in demo workflow. (Fictional demo report)', status: 'Rejected', loc: 'Green Park Parking', city: 'Demo City', district: 'West', state: 'Demo State', lat: 12.9760, lng: 77.5680, days: 12, officer: null },
    { i: 11, u: 0, title: 'UPI payment scam call', category: 'Cybercrime', desc: 'Received fraudulent call requesting UPI PIN to "verify" account. No transfer made and the caller number was recorded for awareness. (Fictional demo report)', status: 'Verified', loc: 'Maple Street', city: 'Demo City', district: 'Central', state: 'Demo State', lat: 12.9705, lng: 77.5960, days: 6, officer: null },
    { i: 12, u: 1, title: 'Car window smashed in parking lot', category: 'Vandalism', desc: 'Car rear window found smashed in a public parking lot; no items confirmed missing. Nearby vehicles and parking attendant may have additional information. (Fictional demo report)', status: 'Under Review', loc: 'Metro Parking Lot', city: 'Demo City', district: 'North', state: 'Demo State', lat: 12.9840, lng: 77.6000, days: 9, officer: null },
    { i: 13, u: 2, title: 'Fake job offer asking for fees', category: 'Fraud', desc: 'Received a fake job offer email requesting processing fees and personal documents. Email headers and payment request details were preserved for review. (Fictional demo report)', status: 'Resolved', loc: 'Hill Road', city: 'Demo City', district: 'East', state: 'Demo State', lat: 12.9670, lng: 77.6120, days: 25, officer: 0 },
    { i: 14, u: 3, title: 'Chain snatching near temple', category: 'Robbery', desc: 'Gold chain reportedly snatched near temple entrance in early morning hours. Complainant provided time, direction of escape, and nearby landmark details. (Fictional demo report)', status: 'Under Investigation', loc: 'Temple Street', city: 'Demo City', district: 'South', state: 'Demo State', lat: 12.9590, lng: 77.5850, days: 8, officer: 2 },
    { i: 15, u: 4, title: 'Suspicious person loitering at night', category: 'Other', desc: 'Suspicious individual seen loitering near residential gate at night; requesting increased patrol and lighting checks in the area. (Fictional demo report)', status: 'Submitted', loc: 'Green Park Gate 2', city: 'Demo City', district: 'West', state: 'Demo State', lat: 12.9740, lng: 77.5720, days: 1, officer: null },

    // Additional demo complaints (more dashboard/content variety)
    { i: 16, u: 0, title: 'Lost wallet near community center', category: 'Theft', desc: 'Wallet misplaced or possibly stolen near the community center entrance. Contains non-sensitive cards and a small amount of cash. (Fictional demo report)', status: 'Under Review', loc: 'Community Center', city: 'Demo City', district: 'Central', state: 'Demo State', lat: 12.9731, lng: 77.5931, days: 2, officer: null },
    { i: 17, u: 1, title: 'Social media impersonation profile', category: 'Cybercrime', desc: 'A fake social media profile impersonating the complainant was reported. Friends received suspicious messages requesting money. (Fictional demo report)', status: 'Assigned', loc: 'Lake View Apartments', city: 'Demo City', district: 'North', state: 'Demo State', lat: 12.9815, lng: 77.6042, days: 6, officer: 0 },
    { i: 18, u: 2, title: 'Shop shutter lock damaged', category: 'Vandalism', desc: 'Attempted break-in suspected after shop shutter lock was found damaged in the morning. No confirmed entry or theft at this time. (Fictional demo report)', status: 'Verified', loc: 'Market Lane', city: 'Demo City', district: 'East', state: 'Demo State', lat: 12.9662, lng: 77.6114, days: 10, officer: null },
    { i: 19, u: 3, title: 'Threatening messages from unknown number', category: 'Harassment', desc: 'Complainant received repeated threatening text messages from an unknown number. Screenshots and timestamps documented for investigation. (Fictional demo report)', status: 'Under Investigation', loc: 'River Side Block A', city: 'Demo City', district: 'South', state: 'Demo State', lat: 12.9588, lng: 77.5812, days: 4, officer: 1 },
    { i: 20, u: 4, title: 'Package theft from doorstep', category: 'Theft', desc: 'Delivery package reported stolen from doorstep shortly after delivery notification. Neighbor reported seeing an unknown person nearby. (Fictional demo report)', status: 'Resolved', loc: 'Green Park Lane 3', city: 'Demo City', district: 'West', state: 'Demo State', lat: 12.9758, lng: 77.5711, days: 18, officer: 2 },
    { i: 21, u: 0, title: 'Noise and nuisance complaint', category: 'Other', desc: 'Repeated late-night noise reported from a nearby construction storage area. Requesting administrative follow-up and monitoring. (Fictional demo report)', status: 'Submitted', loc: 'Maple Street Extension', city: 'Demo City', district: 'Central', state: 'Demo State', lat: 12.9709, lng: 77.5952, days: 1, officer: null },
    { i: 22, u: 1, title: 'Credit card misuse alert', category: 'Fraud', desc: 'Unauthorized small transactions noticed on credit card statement. Bank notified and card temporarily blocked by complainant. (Fictional demo report)', status: 'Under Investigation', loc: 'Lake View Apartments', city: 'Demo City', district: 'North', state: 'Demo State', lat: 12.9824, lng: 77.6022, days: 5, officer: 0 },
    { i: 23, u: 3, title: 'Public property bench damaged', category: 'Vandalism', desc: 'Wooden bench in public walkway found broken and damaged. Possible vandalism reported by local residents. (Fictional demo report)', status: 'Assigned', loc: 'Riverside Walkway', city: 'Demo City', district: 'South', state: 'Demo State', lat: 12.9611, lng: 77.5839, days: 3, officer: 2 },

    // Noor Mohammad's complaints (rich content for Noor login/dashboard)
    { i: 24, u: 5, title: 'Laptop bag stolen from café', category: 'Theft', desc: 'Laptop bag containing a notebook, charger, and personal documents was taken from beside the chair at a café on Sunrise Avenue. The incident occurred around evening hours; staff were informed and nearby seating area details are available. (Fictional demo report)', status: 'Under Investigation', loc: 'Sunrise Avenue Café', city: 'Demo City', district: 'Central', state: 'Demo State', lat: 12.9698, lng: 77.5918, days: 2, officer: 1 },
    { i: 25, u: 5, title: 'Suspicious phishing SMS requesting KYC update', category: 'Cybercrime', desc: 'Received multiple SMS messages claiming urgent KYC update with a shortened link. No link was opened and no personal or banking details were shared. Message content and sender number were saved for review. (Fictional demo report)', status: 'Verified', loc: 'Sunrise Avenue Residence', city: 'Demo City', district: 'Central', state: 'Demo State', lat: 12.9692, lng: 77.5925, days: 4, officer: null },
    { i: 26, u: 5, title: 'Bike mirror broken in parking area', category: 'Vandalism', desc: 'Motorbike side mirror found broken in the apartment parking area in the morning. Possible intentional damage; requesting review of parking-area precautions. (Fictional demo report)', status: 'Assigned', loc: 'Sunrise Avenue Parking', city: 'Demo City', district: 'Central', state: 'Demo State', lat: 12.9695, lng: 77.5938, days: 6, officer: 2 },
    { i: 27, u: 5, title: 'Unauthorized transaction attempt on payment app', category: 'Fraud', desc: 'Received an alert for an unauthorized payment attempt on a mobile payment app, which was declined. App PIN changed immediately and bank notified as a precaution. (Fictional demo report)', status: 'Under Review', loc: 'Sunrise Avenue Residence', city: 'Demo City', district: 'Central', state: 'Demo State', lat: 12.9691, lng: 77.5923, days: 1, officer: null },
    { i: 28, u: 5, title: 'Verbal harassment during commute', category: 'Harassment', desc: 'Experienced repeated verbal harassment during evening commute near the metro entry point. Incident details, approximate time, and route information provided to assist follow-up. (Fictional demo report)', status: 'Submitted', loc: 'Metro Entry Point, Sunrise Road', city: 'Demo City', district: 'Central', state: 'Demo State', lat: 12.9702, lng: 77.5971, days: 0, officer: null },
    { i: 29, u: 5, title: 'Recovered lost ID after report follow-up', category: 'Other', desc: 'Reported a missing ID card near local shops; after follow-up the item was recovered and returned. Case documented and closed as resolved in demo records. (Fictional demo report)', status: 'Resolved', loc: 'Local Market, Sunrise Avenue', city: 'Demo City', district: 'Central', state: 'Demo State', lat: 12.9687, lng: 77.5910, days: 15, officer: 0 },
    { i: 30, u: 5, title: 'Attempted scam call posing as support agent', category: 'Cybercrime', desc: 'Received a phone call from someone posing as customer support requesting remote access to device. Call was declined and no access was granted. (Fictional demo report)', status: 'Under Review', loc: 'Sunrise Avenue Residence', city: 'Demo City', district: 'Central', state: 'Demo State', lat: 12.9693, lng: 77.5926, days: 3, officer: null },
  ];

  const reports = [];
  for (const r of reportDefs) {
    const d = daysAgo(r.days);
    const complaintId = demoComplaintIds[r.i - 1];
    const assignedOfficer = r.officer != null ? officers[r.officer]._id : null;
    const report = await CrimeReport.create({
      complaintId,
      userId: citizens[r.u]._id,
      title: r.title,
      category: r.category,
      description: r.desc,
      incidentDate: fmtDate(d),
      incidentTime: '14:30',
      location: r.loc,
      city: r.city,
      district: r.district,
      state: r.state,
      latitude: r.lat,
      longitude: r.lng,
      evidenceFiles: [],
      aiCategorySuggestion: { category: r.category, confidence: 0.82 },
      aiSummary: r.desc.slice(0, 160),
      status: r.status,
      assignedOfficer,
      createdAt: d,
      updatedAt: d,
    });
    reports.push(report);

    const history = [{ status: 'Submitted', remarks: 'Complaint submitted by citizen (demo)', at: d }];
    if (['Under Review', 'Verified', 'Assigned', 'Under Investigation', 'Resolved', 'Rejected'].includes(r.status)) {
      history.push({ status: 'Under Review', remarks: 'Under review by admin (demo)', at: daysAgo(Math.max(r.days - 1, 0)) });
    }
    if (['Verified', 'Assigned', 'Under Investigation', 'Resolved'].includes(r.status)) {
      history.push({ status: 'Verified', remarks: 'Report verified (demo)', at: daysAgo(Math.max(r.days - 2, 0)) });
    }
    if (['Assigned', 'Under Investigation', 'Resolved'].includes(r.status) && r.officer != null) {
      history.push({ status: 'Assigned', remarks: 'Case assigned to officer (demo)', at: daysAgo(Math.max(r.days - 2, 0)) });
    }
    if (['Under Investigation', 'Resolved'].includes(r.status)) {
      history.push({ status: 'Under Investigation', remarks: 'Investigation in progress (demo)', at: daysAgo(Math.max(r.days - 1, 0)) });
    }
    if (['Resolved', 'Rejected'].includes(r.status)) {
      history.push({ status: r.status, remarks: `Case ${r.status.toLowerCase()} (demo)`, at: daysAgo(Math.max(r.days - 1, 0)) });
    }
    await ComplaintStatus.insertMany(history.map((h) => ({ complaintId, status: h.status, updatedBy: admin._id, remarks: h.remarks, updatedAt: h.at })));

    if (r.officer != null && ['Assigned', 'Under Investigation', 'Resolved'].includes(r.status)) {
      await AssignedCase.create({ complaintId, officerId: officers[r.officer]._id, adminId: admin._id, assignedDate: daysAgo(Math.max(r.days - 2, 0)), caseStatus: r.status });
      await PoliceOfficer.updateOne({ _id: officers[r.officer]._id }, { $addToSet: { assignedCases: report._id } });
      await InvestigationNote.create({ complaintId, officerId: officers[r.officer]._id, notes: 'Initial investigation note recorded (fictional demo data).', attachments: [], createdAt: daysAgo(Math.max(r.days - 1, 0)) });
    }

    await Notification.create({ userId: citizens[r.u]._id, title: 'Complaint Update (Demo)', message: `Your complaint ${complaintId} is currently ${r.status}.`, type: 'status', isRead: r.i % 3 === 0, createdAt: daysAgo(Math.max(r.days - 1, 0)) });
  }

  await PublicSafetyAlert.insertMany([
    { title: 'Fictional Demo: Stay Alert in Crowded Areas', description: 'Demo alert: Keep personal belongings secure in crowded public places and report suspicious activity promptly.', location: 'Demo City - Central District', severity: 'medium', publishedBy: admin._id, createdAt: daysAgo(2) },
    { title: 'Fictional Demo: Cyber Safety Reminder', description: 'Demo alert: Do not share OTPs or banking credentials. Verify links before clicking and report phishing attempts.', location: 'Demo City - All Areas', severity: 'high', publishedBy: admin._id, createdAt: daysAgo(1) },
  ]);

  await AuditLog.insertMany([
    { userId: admin._id, action: 'SEED_DATABASE', resourceType: 'System', resourceId: 'seed', timestamp: now },
    { userId: admin._id, action: 'CREATE_DEMO_DATA', resourceType: 'System', resourceId: 'demo', timestamp: now },
  ]);

  console.log('Seed complete.');
  console.log('Demo accounts (all fictional):');
  console.log('  Admin:   admin@crimetrack.demo / Password@123');
  console.log('  Officer: officer1@crimetrack.demo / Password@123');
  console.log('  Officer: officer2@crimetrack.demo / Password@123');
  console.log('  Officer: officer3@crimetrack.demo / Password@123');
  console.log('  Citizen: citizen1@crimetrack.demo / Password@123 (..citizen5)');
  console.log('  Citizen: noor@crimetrack.demo / Password@123 (Noor Mohammad - sample complaints)');
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
