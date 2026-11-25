const express = require('express');
const { body } = require('express-validator');
const asyncHandler = require('../middleware/asyncHandler');
const { protect } = require('../middleware/auth');
const authController = require('../controllers/authController');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').optional().isLength({ min: 7 }).withMessage('Phone number is invalid'),
  ],
  asyncHandler(authController.register)
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  asyncHandler(authController.login)
);

router.post('/logout', protect, asyncHandler(authController.logout));
router.get('/me', protect, asyncHandler(authController.me));

module.exports = router;
