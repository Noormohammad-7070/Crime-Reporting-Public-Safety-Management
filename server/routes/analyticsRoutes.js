const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { protect, authorize } = require('../middleware/auth');
const analyticsController = require('../controllers/analyticsController');

const router = express.Router();
router.get('/monthly', protect, authorize('admin', 'officer'), asyncHandler(analyticsController.monthly));
router.get('/categories', protect, authorize('admin', 'officer'), asyncHandler(analyticsController.categories));
router.get('/status', protect, authorize('admin', 'officer'), asyncHandler(analyticsController.status));
router.get('/weekly', protect, authorize('admin', 'officer'), asyncHandler(analyticsController.weekly));
router.get('/hotspots', protect, authorize('admin', 'officer', 'citizen'), asyncHandler(analyticsController.hotspots));
module.exports = router;
