const express = require('express');
const router = express.Router();
const { getOrders, cancelOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.get('/',           protect, getOrders);
router.patch('/:id/cancel', protect, cancelOrder);

module.exports = router;
