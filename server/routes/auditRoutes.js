const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { protect, authorize } = require('../middleware/auth');
const auditController = require('../controllers/auditController');

const router = express.Router();
router.get('/', protect, authorize('admin'), asyncHandler(auditController.list));
module.exports = router;
