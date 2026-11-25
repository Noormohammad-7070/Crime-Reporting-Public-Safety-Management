const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { protect } = require('../middleware/auth');
const aiController = require('../controllers/aiController');

const router = express.Router();
router.post('/classify', protect, asyncHandler(aiController.classify));
router.post('/summarize', protect, asyncHandler(aiController.summarize));
router.post('/duplicate-check', protect, asyncHandler(aiController.duplicateCheck));
router.post('/chat', asyncHandler(aiController.chat)); // chatbot accessible from public/AI assistant page; protect optional
module.exports = router;
