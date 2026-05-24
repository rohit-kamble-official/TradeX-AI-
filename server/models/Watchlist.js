const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symbols: [{
    symbol:    { type: String, uppercase: true },
    addedAt:   { type: Date, default: Date.now },
    alertPrice:{ type: Number, default: null },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Watchlist', watchlistSchema);
