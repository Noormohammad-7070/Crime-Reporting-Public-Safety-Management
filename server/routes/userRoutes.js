const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { protect, authorize } = require('../middleware/auth');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/citizens', protect, authorize('admin'), asyncHandler(userController.listCitizens));
router.get('/me/profile', protect, asyncHandler(userController.getProfile));
router.put('/me/profile', protect, asyncHandler(userController.updateProfile));
router.delete('/citizens/:id', protect, authorize('admin'), asyncHandler(userController.deleteCitizen));

module.exports = router;
