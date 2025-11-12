const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email'],
    index: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  isVerified: { // <-- for email OTP verification
    type: Boolean,
    default: false
  },
  otpToken: String,         // <-- OTP for email verification
  otpExpires: Date,
  resetToken: String,       // <-- Password reset token
  resetTokenExpires: Date,

  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  profile: {
    age: { type: Number, min: 13, max: 100 },
    education: { type: String, trim: true, maxlength: 100 },
    experience: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    interests: [{ type: String, trim: true, maxlength: 30 }]
  },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date, default: Date.now, index: true },
  refreshToken: { type: String, select: false },
  stats: {
    totalRoadmaps: { type: Number, default: 0 },
    totalChats: { type: Number, default: 0 },
    coursesCompleted: { type: Number, default: 0 }
  },

  // --- Added for games session/cooldown ---
  gameSession: {
    isActive: { type: Boolean, default: false },       // true = user has an active games session running
    startedAt: { type: Date },                         // when the current games session started
    expiresAt: { type: Date },                         // when this session should auto-expire (start + 15 min)
    cooldownUntil: { type: Date },                     // when user can play games next (ends at session end + 1hr)
    // Optionally add lastGamePlayed: { type: String } here if needed
  }
  
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      delete ret.__v;
      delete ret.password;
      delete ret.refreshToken;
      delete ret.otpToken;
      delete ret.otpExpires;
      delete ret.resetToken;
      delete ret.resetTokenExpires;
      return ret;
    }
  }
});

userSchema.index({ email: 1 }, { unique: true });
// ... all your original indexes

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10); // Reduced from 12 to 10 for faster registration
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.updateLastLogin = function () {
  this.lastLogin = new Date();
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
