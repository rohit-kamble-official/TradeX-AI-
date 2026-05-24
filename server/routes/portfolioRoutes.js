const express = require('express');
const router = express.Router();
const { getPortfolio, getSummary } = require('../controllers/portfolioController');
const { protect } = require('../middleware/auth');

router.get('/',        protect, getPortfolio);
router.get('/summary', protect, getSummary);

module.exports = router;
