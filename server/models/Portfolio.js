const mongoose = require('mongoose');

const holdingSchema = new mongoose.Schema({
  symbol:     { type: String, required: true, uppercase: true },
  stockName:  { type: String },
  quantity:   { type: Number, required: true, min: 0 },
  avgPrice:   { type: Number, required: true },
  currentPrice:{ type: Number, default: 0 },
  investedValue:{ type: Number, default: 0 },
  currentValue: { type: Number, default: 0 },
  pnl:        { type: Number, default: 0 },
  pnlPercent: { type: Number, default: 0 },
});

const portfolioSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  holdings:   [holdingSchema],
  totalInvested: { type: Number, default: 0 },
  currentValue:  { type: Number, default: 0 },
  totalPnl:      { type: Number, default: 0 },
  totalPnlPct:   { type: Number, default: 0 },
  dayPnl:        { type: Number, default: 0 },
  dayPnlPct:     { type: Number, default: 0 },
  pnlHistory: [{
    date:  { type: Date, default: Date.now },
    value: { type: Number },
    pnl:   { type: Number },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);
