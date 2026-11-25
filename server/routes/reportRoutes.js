const express = require('express');
const { body } = require('express-validator');
const asyncHandler = require('../middleware/asyncHandler');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const reportController = require('../controllers/reportController');

const router = express.Router();

// Optional auth helper for tracking: attach user if token present
const optionalAuth = async (req, res, next) => {
  const auth = require('../middleware/auth');
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return auth.protect(req, res, next);
  }
  return next();
};

router.post(
  '/',
  protect,
  authorize('citizen'),
  upload.array('evidenceFiles', 5),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('incidentDate').notEmpty().withMessage('Incident date is required'),
    body('incidentTime').notEmpty().withMessage('Incident time is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
  ],
  asyncHandler(reportController.createReport)
);

router.get('/', protect, authorize('admin', 'citizen', 'officer'), asyncHandler(reportController.listReports));
router.get('/my', protect, authorize('citizen'), asyncHandler(reportController.myReports));
router.get('/track/:complaintId', optionalAuth, asyncHandler(reportController.trackByComplaintId));
router.get('/:id', protect, asyncHandler(reportController.getReportById));
router.put('/:id/status', protect, authorize('admin', 'officer'), asyncHandler(reportController.updateStatus));
router.delete('/:id', protect, authorize('admin'), asyncHandler(reportController.deleteReport));

module.exports = router;
