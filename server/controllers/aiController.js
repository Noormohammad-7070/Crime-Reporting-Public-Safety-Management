const axios = require('axios');
const CrimeReport = require('../models/CrimeReport');

const AI_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
const CATEGORIES = ['Theft', 'Robbery', 'Cybercrime', 'Harassment', 'Assault', 'Missing Person', 'Fraud', 'Vandalism', 'Domestic Violence', 'Other'];

function fallbackClassify(description = '') {
  const d = String(description).toLowerCase();
  const rules = [
    ['Cybercrime', ['online', 'hack', 'phish', 'scam', 'otp', 'internet', 'email', 'upi', 'password', 'account']],
    ['Theft', ['stole', 'stolen', 'theft', 'pickpocket', 'snatched', 'wallet', 'phone stolen', 'bike stolen']],
    ['Robbery', ['robbed', 'robbery', 'armed', 'gun', 'knife', 'looted', 'mugged']],
    ['Harassment', ['harass', 'stalk', 'abuse', 'threaten', 'bully', 'lewd']],
    ['Assault', ['assault', 'attack', 'hit', 'beat', 'injury', 'violence', 'stab']],
    ['Missing Person', ['missing', 'not found', 'disappeared', 'lost person', 'kidnap']],
    ['Fraud', ['fraud', 'cheat', 'forgery', 'fake', 'impersonat', 'scam money']],
    ['Vandalism', ['vandal', 'damage', 'graffiti', 'broken', 'destroyed property', 'smashed']],
    ['Domestic Violence', ['domestic', 'spouse', 'partner abuse', 'family violence', 'in-laws', 'husband', 'wife']],
  ];
  for (const [category, keys] of rules) {
    if (keys.some((k) => d.includes(k))) return { category, confidence: 0.74, source: 'fallback' };
  }
  return { category: 'Other', confidence: 0.5, source: 'fallback' };
}

function fallbackSummarize(text = '', title = '') {
  const clean = String(text).replace(/\s+/g, ' ').trim();
  const base = clean || String(title || '').trim();
  const summary = base.length <= 220 ? base : `${base.slice(0, 217)}...`;
  return { summary, source: 'fallback' };
}

function textSimilarity(a = '', b = '') {
  const tokens = (s) => new Set(String(s).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((t) => t.length > 2));
  const A = tokens(a); const B = tokens(b);
  if (!A.size || !B.size) return 0;
  let inter = 0;
  A.forEach((t) => { if (B.has(t)) inter += 1; });
  return inter / Math.max(A.size, B.size);
}

function fallbackDuplicate(report = {}, existing = []) {
  const matches = existing.map((e) => {
    let score = 0;
    const sim = textSimilarity(`${report.title} ${report.description}`, `${e.title || ''} ${e.description || ''}`);
    score += sim * 0.7;
    if (report.incidentDate && e.incidentDate && String(report.incidentDate).slice(0, 10) === String(e.incidentDate).slice(0, 10)) score += 0.15;
    if (report.location && e.location && String(report.location).toLowerCase() === String(e.location).toLowerCase()) score += 0.1;
    if (report.category && e.category && report.category === e.category) score += 0.05;
    return { complaintId: e.complaintId, title: e.title, category: e.category, similarity: Number(score.toFixed(2)), date: e.incidentDate, location: e.location };
  }).filter((m) => m.similarity >= 0.45).sort((a, b) => b.similarity - a.similarity).slice(0, 5);
  return { possibleDuplicates: matches, source: 'fallback' };
}

function fallbackChat(message = '') {
  const m = String(message).toLowerCase();
  if (m.includes('track') || m.includes('status') || m.includes('complaint id')) {
    return { reply: 'To track a complaint, go to "Track Complaint" and enter your unique complaint ID (e.g., CT-2026-123456). You can view the current status, timeline, and latest updates. If you are logged in, you may see additional authorized details for your own complaint.', source: 'fallback' };
  }
  if (m.includes('report') || m.includes('file') || m.includes('submit')) {
    return { reply: 'To submit a crime report: register or log in as a citizen, open "Report a Crime", fill in the incident details (category, date/time, location, description), optionally upload evidence, and submit. You will receive a unique complaint ID to track progress.', source: 'fallback' };
  }
  if (m.includes('emergency') || m.includes('police number') || m.includes('ambulance') || m.includes('fire')) {
    return { reply: 'If you are in immediate danger, contact local emergency services right away. Common emergency numbers: Police 100, Ambulance 108/102, Fire 101, Women Helpline 1091, Child Helpline 1098, National Emergency 112 (availability may vary by region). I am an AI assistant and not an emergency response service.', source: 'fallback' };
  }
  if (m.includes('safety') || m.includes('tips') || m.includes('prevent')) {
    return { reply: 'General safety tips: stay aware of your surroundings, avoid sharing sensitive personal information with strangers, keep emergency contacts handy, secure your home and devices, and report suspicious activity promptly through official channels. For immediate threats, contact emergency services.', source: 'fallback' };
  }
  return { reply: 'I can help with general public safety questions, how to submit a crime report, how to track complaint status, and emergency contact information. I am not an emergency response service and cannot identify suspects or make enforcement decisions. How can I assist you?', source: 'fallback' };
}

async function proxyOrFallback(path, payload, fallbackFn) {
  try {
    const res = await axios.post(`${AI_URL}${path}`, payload, { timeout: 5000 });
    return res.data;
  } catch (e) {
    return fallbackFn(payload);
  }
}

exports.classify = async (req, res) => {
  const { description, category } = req.body || {};
  const data = await proxyOrFallback('/classify', { description, category }, () => fallbackClassify(description));
  if (data && data.category && !CATEGORIES.includes(data.category)) data.category = 'Other';
  res.json(data);
};

exports.summarize = async (req, res) => {
  const { description, title } = req.body || {};
  const data = await proxyOrFallback('/summarize', { description, title }, () => fallbackSummarize(description, title));
  res.json(data);
};

exports.duplicateCheck = async (req, res) => {
  const { report } = req.body || {};
  let existing = req.body?.existing;
  if (!Array.isArray(existing)) {
    existing = await CrimeReport.find({}, 'complaintId title description incidentDate location city district category createdAt').sort({ createdAt: -1 }).limit(200).lean();
  }
  const data = await proxyOrFallback('/duplicate-check', { report, existing }, () => fallbackDuplicate(report || {}, existing || []));
  res.json(data);
};

exports.chat = async (req, res) => {
  const { message } = req.body || {};
  const data = await proxyOrFallback('/chat', { message }, () => fallbackChat(message));
  res.json(data);
};
