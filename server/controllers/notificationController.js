const Notification = require('../models/Notification');

exports.list = async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(100).lean();
  res.json(notifications);
};

exports.markRead = async (req, res) => {
  const notification = await Notification.findOne({ _id: req.params.id, userId: req.user._id });
  if (!notification) return res.status(404).json({ message: 'Notification not found' });
  notification.isRead = true;
  await notification.save();
  res.json(notification);
};

exports.markAllRead = async (req, res) => {
  await Notification.updateMany({ userId: req.user._id, isRead: false }, { $set: { isRead: true } });
  res.json({ message: 'All notifications marked as read' });
};
