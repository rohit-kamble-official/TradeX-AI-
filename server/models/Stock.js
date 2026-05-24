const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  symbol:    { type: String, required: true, unique: true, uppercase: true },
  name:      { type: String, required: true },
  exchange:  { type: String, default: 'NSE' },
  sector:    { type: String, default: 'Unknown' },
  price:     { type: Number, required: true },
  open:      { type: Number, default: 0 },
  high:      { type: Number, default: 0 },
  low:       { type: Number, default: 0 },
  close:     { type: Number, default: 0 },
  prevClose: { type: Number, default: 0 },
  change:    { type: Number, default: 0 },
  changePct: { type: Number, default: 0 },
  volume:    { type: Number, default: 0 },
  marketCap: { type: Number, default: 0 },
  pe:        { type: Number, default: 0 },
  eps:       { type: Number, default: 0 },
  high52w:   { type: Number, default: 0 },
  low52w:    { type: Number, default: 0 },
  priceHistory: [{
    price: Number,
    timestamp: { type: Date, default: Date.now }
  }],
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Stock', stockSchema);
