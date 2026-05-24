const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:           { type: String, required: true, trim: true },
  email:          { type: String, required: true, unique: true, lowercase: true },
  password:       { type: String, required: true, minlength: 6, select: false },
  avatar:         { type: String, default: '' },
  phone:          { type: String, default: '' },
  isVerified:     { type: Boolean, default: false },
  verifyToken:    String,
  resetToken:     String,
  resetExpires:   Date,
  role:           { type: String, enum: ['user', 'admin'], default: 'user' },
  riskProfile:    { type: String, enum: ['conservative', 'moderate', 'aggressive'], default: 'moderate' },
  kycStatus:      { type: String, enum: ['pending', 'submitted', 'approved'], default: 'pending' },
  wallet: {
    balance:      { type: Number, default: 100000 },
    currency:     { type: String, default: 'INR' }
  },
  preferences: {
    theme:        { type: String, default: 'dark' },
    notifications:{ type: Boolean, default: true },
    twoFA:        { type: Boolean, default: false }
  },
  createdAt:      { type: Date, default: Date.now }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare passwords
userSchema.methods.matchPassword = async function(entered) {
  return await bcrypt.compare(entered, this.password);
};

// Remove sensitive fields from JSON output
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.verifyToken;
  delete obj.resetToken;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
