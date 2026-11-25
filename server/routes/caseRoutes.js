const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const caseController = require('../controllers/caseController');

const router = express.Router();

router.post('/assign', protect, authorize('admin'), asyncHandler(caseController.assignCase));
router.get('/assigned', protect, authorize('admin', 'officer'), asyncHandler(caseController.getAssignedCases));
router.put('/:id/update', protect, authorize('admin', 'officer'), asyncHandler(caseController.updateCase));
router.post('/:id/notes', protect, authorize('officer', 'admin'), upload.array('attachments', 5), asyncHandler(caseController.addNote));

module.exports = router;
