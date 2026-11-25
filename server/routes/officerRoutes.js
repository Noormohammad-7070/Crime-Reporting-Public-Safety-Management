const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { protect, authorize } = require('../middleware/auth');
const officerController = require('../controllers/officerController');

const router = express.Router();

router.get('/', protect, authorize('admin', 'officer'), asyncHandler(officerController.listOfficers));
router.post('/', protect, authorize('admin'), asyncHandler(officerController.createOfficer));
router.get('/:id', protect, authorize('admin', 'officer'), asyncHandler(officerController.getOfficer));
router.put('/:id', protect, authorize('admin', 'officer'), asyncHandler(officerController.updateOfficer));

module.exports = router;
