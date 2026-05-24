const Stock = require('../models/Stock');
const { fetchStockData } = require('../services/stockService');

// GET /api/stocks - All stocks
exports.getAllStocks = async (req, res, next) => {
  try {
    const { sector, search, limit = 50 } = req.query;
    const query = {};
    if (sector) query.sector = sector;
    if (search) query.$or = [
      { symbol: { $regex: search, $options: 'i' } },
      { name:   { $regex: search, $options: 'i' } }
    ];
    const stocks = await Stock.find(query).limit(Number(limit)).sort({ marketCap: -1 });
    res.json({ success: true, count: stocks.length, stocks });
  } catch (err) { next(err); }
};

// GET /api/stocks/:symbol
exports.getStock = async (req, res, next) => {
  try {
    let stock = await Stock.findOne({ symbol: req.params.symbol.toUpperCase() });
    if (!stock) return res.status(404).json({ success: false, message: 'Stock not found' });
    res.json({ success: true, stock });
  } catch (err) { next(err); }
};

// GET /api/stocks/:symbol/history
exports.getHistory = async (req, res, next) => {
  try {
    const stock = await Stock.findOne({ symbol: req.params.symbol.toUpperCase() });
    if (!stock) return res.status(404).json({ success: false, message: 'Stock not found' });
    const { period = '1D' } = req.query;
    // Return last N price points based on period
    const limits = { '1D': 78, '1W': 168, '1M': 720, '3M': 2160 };
    const history = stock.priceHistory.slice(-(limits[period] || 78));
    res.json({ success: true, symbol: stock.symbol, period, history });
  } catch (err) { next(err); }
};

// GET /api/stocks/top-gainers
exports.getTopGainers = async (req, res, next) => {
  try {
    const stocks = await Stock.find({ changePct: { $gt: 0 } }).sort({ changePct: -1 }).limit(10);
    res.json({ success: true, stocks });
  } catch (err) { next(err); }
};

// GET /api/stocks/top-losers
exports.getTopLosers = async (req, res, next) => {
  try {
    const stocks = await Stock.find({ changePct: { $lt: 0 } }).sort({ changePct: 1 }).limit(10);
    res.json({ success: true, stocks });
  } catch (err) { next(err); }
};
