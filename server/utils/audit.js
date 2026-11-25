const AuditLog = require('../models/AuditLog');

async function logAudit(userId, action, resourceType, resourceId) {
  try {
    await AuditLog.create({
      userId: userId || undefined,
      action,
      resourceType,
      resourceId: resourceId ? String(resourceId) : undefined,
    });
  } catch (err) {
    console.error('Audit log error:', err.message);
  }
}

module.exports = logAudit;
