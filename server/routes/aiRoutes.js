const express = require('express');
const router = express.Router();
const { chat, predict, analyzePortfolio } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.post('/chat',    protect, chat);
router.post('/predict', protect, predict);
router.post('/analyze', protect, analyzePortfolio);

module.exports = router;
