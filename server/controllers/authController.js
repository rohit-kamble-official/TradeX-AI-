const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const Watchlist = require('../models/Watchlist');
const { sendEmail } = require('../utils/email');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const sendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({ success: true, token, user });
};

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'All fields required' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ success: false, message: 'Email already registered' });

    const verifyToken = crypto.randomBytes(32).toString('hex');
    const user = await User.create({ name, email, password, verifyToken });

    // Create default portfolio & watchlist
    await Portfolio.create({ user: user._id });
    await Watchlist.create({ user: user._id, symbols: [
      { symbol: 'RELIANCE' }, { symbol: 'TCS' }, { symbol: 'INFY' }, { symbol: 'HDFC' }
    ]});

    // Send verification email (non-blocking)
    try {
      await sendEmail({
        to: email,
        subject: 'Verify your TradeX AI account',
        html: `<h2>Welcome to TradeX AI!</h2><p>Click <a href="${process.env.CLIENT_URL}/verify/${verifyToken}">here</a> to verify your account.</p>`
      });
    } catch(e) { console.warn('Email send failed:', e.message); }

    sendToken(user, 201, res);
  } catch (err) { next(err); }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required' });

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    sendToken(user, 200, res);
  } catch (err) { next(err); }
};

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ success: false, message: 'No user with that email' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetExpires = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save({ validateBeforeSave: false });

    try {
      await sendEmail({
        to: user.email,
        subject: 'Reset your TradeX AI password',
        html: `<p>Reset link: <a href="${process.env.CLIENT_URL}/reset-password/${resetToken}">Reset Password</a> (expires in 10 min)</p>`
      });
      res.json({ success: true, message: 'Reset email sent' });
    } catch(e) {
      user.resetToken = undefined; user.resetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      next(e);
    }
  } catch (err) { next(err); }
};

// POST /api/auth/reset-password/:token
exports.resetPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ resetToken: req.params.token, resetExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired token' });

    user.password = req.body.password;
    user.resetToken = undefined; user.resetExpires = undefined;
    await user.save();
    sendToken(user, 200, res);
  } catch (err) { next(err); }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// PUT /api/auth/update-profile
exports.updateProfile = async (req, res, next) => {
  try {
    const allowed = ['name', 'phone', 'riskProfile', 'preferences'];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json({ success: true, user });
  } catch (err) { next(err); }
};
