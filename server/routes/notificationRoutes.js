const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { protect } = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');

const router = express.Router();
router.get('/', protect, asyncHandler(notificationController.list));
router.put('/read-all', protect, asyncHandler(notificationController.markAllRead));
router.put('/:id/read', protect, asyncHandler(notificationController.markRead));
module.exports = router;
