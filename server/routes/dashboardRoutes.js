const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { protect, authorize } = require('../middleware/auth');
const dashboardController = require('../controllers/dashboardController');

const router = express.Router();
router.get('/admin', protect, authorize('admin'), asyncHandler(dashboardController.adminDashboard));
router.get('/citizen', protect, authorize('citizen'), asyncHandler(dashboardController.citizenDashboard));
router.get('/officer', protect, authorize('officer'), asyncHandler(dashboardController.officerDashboard));
module.exports = router;
