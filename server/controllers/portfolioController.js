const Portfolio = require('../models/Portfolio');
const Stock = require('../models/Stock');

// GET /api/portfolio
exports.getPortfolio = async (req, res, next) => {
  try {
    let portfolio = await Portfolio.findOne({ user: req.user._id });
    if (!portfolio) portfolio = await Portfolio.create({ user: req.user._id });

    // Refresh current prices from Stock collection
    let totalInvested = 0, currentValue = 0;
    for (const h of portfolio.holdings) {
      const stock = await Stock.findOne({ symbol: h.symbol });
      if (stock) {
        h.currentPrice  = stock.price;
        h.currentValue  = stock.price * h.quantity;
        h.investedValue = h.avgPrice * h.quantity;
        h.pnl           = h.currentValue - h.investedValue;
        h.pnlPercent    = ((h.pnl / h.investedValue) * 100) || 0;
      }
      totalInvested += h.investedValue || 0;
      currentValue  += h.currentValue || 0;
    }
    portfolio.totalInvested = totalInvested;
    portfolio.currentValue  = currentValue;
    portfolio.totalPnl      = currentValue - totalInvested;
    portfolio.totalPnlPct   = totalInvested > 0 ? ((portfolio.totalPnl / totalInvested) * 100) : 0;
    await portfolio.save();

    res.json({ success: true, portfolio });
  } catch (err) { next(err); }
};

// GET /api/portfolio/summary
exports.getSummary = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user._id });
    const user = req.user;
    res.json({
      success: true,
      summary: {
        walletBalance: user.wallet.balance,
        totalInvested: portfolio?.totalInvested || 0,
        currentValue:  portfolio?.currentValue  || 0,
        totalPnl:      portfolio?.totalPnl      || 0,
        totalPnlPct:   portfolio?.totalPnlPct   || 0,
        holdingsCount: portfolio?.holdings.length || 0,
      }
    });
  } catch (err) { next(err); }
};
