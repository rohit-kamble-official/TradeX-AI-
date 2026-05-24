const Order = require('../models/Order');
const Portfolio = require('../models/Portfolio');
const User = require('../models/User');
const Stock = require('../models/Stock');

// POST /api/trade/buy
exports.buyStock = async (req, res, next) => {
  try {
    const { symbol, quantity, price, orderType = 'MARKET' } = req.body;
    if (!symbol || !quantity || !price)
      return res.status(400).json({ success: false, message: 'symbol, quantity, price required' });

    const totalValue = quantity * price;
    const user = await User.findById(req.user._id);

    if (user.wallet.balance < totalValue)
      return res.status(400).json({ success: false, message: 'Insufficient wallet balance' });

    const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });
    if (!stock) return res.status(404).json({ success: false, message: 'Stock not found' });

    // Deduct wallet
    user.wallet.balance -= totalValue;
    await user.save({ validateBeforeSave: false });

    // Create order
    const order = await Order.create({
      user: user._id, symbol: symbol.toUpperCase(), stockName: stock.name,
      type: 'BUY', orderType, quantity, price, totalValue, status: 'EXECUTED', executedAt: new Date()
    });

    // Update portfolio
    let portfolio = await Portfolio.findOne({ user: user._id });
    if (!portfolio) portfolio = await Portfolio.create({ user: user._id });

    const idx = portfolio.holdings.findIndex(h => h.symbol === symbol.toUpperCase());
    if (idx >= 0) {
      const h = portfolio.holdings[idx];
      const newQty = h.quantity + quantity;
      h.avgPrice = ((h.avgPrice * h.quantity) + (price * quantity)) / newQty;
      h.quantity = newQty;
    } else {
      portfolio.holdings.push({ symbol: symbol.toUpperCase(), stockName: stock.name, quantity, avgPrice: price, currentPrice: price });
    }

    // Recalculate totals
    portfolio.totalInvested += totalValue;
    portfolio.currentValue  += totalValue;
    await portfolio.save();

    res.status(201).json({ success: true, order, walletBalance: user.wallet.balance });
  } catch (err) { next(err); }
};

// POST /api/trade/sell
exports.sellStock = async (req, res, next) => {
  try {
    const { symbol, quantity, price, orderType = 'MARKET' } = req.body;
    const totalValue = quantity * price;

    const portfolio = await Portfolio.findOne({ user: req.user._id });
    const holding = portfolio?.holdings.find(h => h.symbol === symbol.toUpperCase());

    if (!holding || holding.quantity < quantity)
      return res.status(400).json({ success: false, message: 'Insufficient holdings' });

    const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });

    // Credit wallet
    const user = await User.findById(req.user._id);
    user.wallet.balance += totalValue;
    await user.save({ validateBeforeSave: false });

    // Create order
    const order = await Order.create({
      user: user._id, symbol: symbol.toUpperCase(), stockName: stock?.name,
      type: 'SELL', orderType, quantity, price, totalValue, status: 'EXECUTED', executedAt: new Date()
    });

    // Update holdings
    holding.quantity -= quantity;
    const soldValue = holding.avgPrice * quantity;
    portfolio.totalInvested = Math.max(0, portfolio.totalInvested - soldValue);

    if (holding.quantity === 0) {
      portfolio.holdings = portfolio.holdings.filter(h => h.symbol !== symbol.toUpperCase());
    }

    portfolio.currentValue = Math.max(0, portfolio.currentValue - totalValue);
    portfolio.totalPnl = portfolio.currentValue - portfolio.totalInvested;
    await portfolio.save();

    res.json({ success: true, order, walletBalance: user.wallet.balance });
  } catch (err) { next(err); }
};
