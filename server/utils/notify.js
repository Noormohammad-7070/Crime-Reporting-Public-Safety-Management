const Notification = require('../models/Notification');

async function createNotification({ userId, title, message, type = 'info' }) {
  if (!userId) return null;
  try {
    return await Notification.create({ userId, title, message, type });
  } catch (err) {
    console.error('Notification error:', err.message);
    return null;
  }
}

module.exports = createNotification;
