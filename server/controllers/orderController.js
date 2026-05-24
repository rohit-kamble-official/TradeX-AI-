const Order = require('../models/Order');

exports.getOrders = async (req, res, next) => {
  try {
    const { type, status, limit = 50, page = 1 } = req.query;
    const query = { user: req.user._id };
    if (type)   query.type   = type.toUpperCase();
    if (status) query.status = status.toUpperCase();

    const total  = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    res.json({ success: true, total, page: Number(page), orders });
  } catch (err) { next(err); }
};

exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.status !== 'PENDING')
      return res.status(400).json({ success: false, message: 'Only pending orders can be cancelled' });
    order.status = 'CANCELLED';
    await order.save();
    res.json({ success: true, order });
  } catch (err) { next(err); }
};
