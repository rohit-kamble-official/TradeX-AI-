const express = require('express');
const router = express.Router();
const { getAllStocks, getStock, getHistory, getTopGainers, getTopLosers } = require('../controllers/stockController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getAllStocks);
router.get('/gainers', protect, getTopGainers);
router.get('/losers', protect, getTopLosers);
router.get('/:symbol', protect, getStock);
router.get('/:symbol/history', protect, getHistory);

module.exports = router;
