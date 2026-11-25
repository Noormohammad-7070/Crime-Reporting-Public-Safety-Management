const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { protect, authorize } = require('../middleware/auth');
const alertController = require('../controllers/alertController');

const router = express.Router();
router.get('/', protect, asyncHandler(alertController.list));
router.post('/', protect, authorize('admin'), asyncHandler(alertController.create));
router.delete('/:id', protect, authorize('admin'), asyncHandler(alertController.remove));
module.exports = router;
