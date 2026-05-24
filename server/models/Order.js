const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symbol:     { type: String, required: true, uppercase: true },
  stockName:  { type: String },
  type:       { type: String, enum: ['BUY', 'SELL'], required: true },
  orderType:  { type: String, enum: ['MARKET', 'LIMIT', 'STOP_LOSS'], default: 'MARKET' },
  quantity:   { type: Number, required: true, min: 1 },
  price:      { type: Number, required: true },
  totalValue: { type: Number, required: true },
  status:     { type: String, enum: ['PENDING', 'EXECUTED', 'CANCELLED', 'FAILED'], default: 'PENDING' },
  executedAt: { type: Date },
  notes:      { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
