const Watchlist = require('../models/Watchlist');
const Stock = require('../models/Stock');

exports.getWatchlist = async (req, res, next) => {
  try {
    let wl = await Watchlist.findOne({ user: req.user._id });
    if (!wl) wl = await Watchlist.create({ user: req.user._id });

    // Attach live prices
    const enriched = await Promise.all(wl.symbols.map(async item => {
      const stock = await Stock.findOne({ symbol: item.symbol });
      return { ...item.toObject(), stock: stock || null };
    }));
    res.json({ success: true, watchlist: enriched });
  } catch (err) { next(err); }
};

exports.addToWatchlist = async (req, res, next) => {
  try {
    const { symbol } = req.body;
    if (!symbol) return res.status(400).json({ success: false, message: 'Symbol required' });

    const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });
    if (!stock) return res.status(404).json({ success: false, message: 'Stock not found' });

    const wl = await Watchlist.findOne({ user: req.user._id });
    if (wl.symbols.find(s => s.symbol === symbol.toUpperCase()))
      return res.status(409).json({ success: false, message: 'Already in watchlist' });

    wl.symbols.push({ symbol: symbol.toUpperCase() });
    await wl.save();
    res.json({ success: true, message: 'Added to watchlist' });
  } catch (err) { next(err); }
};

exports.removeFromWatchlist = async (req, res, next) => {
  try {
    const wl = await Watchlist.findOne({ user: req.user._id });
    wl.symbols = wl.symbols.filter(s => s.symbol !== req.params.symbol.toUpperCase());
    await wl.save();
    res.json({ success: true, message: 'Removed from watchlist' });
  } catch (err) { next(err); }
};
