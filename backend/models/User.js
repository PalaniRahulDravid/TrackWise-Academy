const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email'],
    index: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
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
  passwordResetToken: String,
  passwordResetExpires: Date,
  stats: {
    totalRoadmaps: { type: Number, default: 0 },
    totalChats: { type: Number, default: 0 },
    coursesCompleted: { type: Number, default: 0 }
  }
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      delete ret.__v;
      delete ret.password;
      delete ret.refreshToken;
      return ret;
    }
  }
});

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ lastLogin: -1 });
userSchema.index({ 'profile.experience': 1 });
userSchema.index({ role: 1, isActive: 1, lastLogin: -1 });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.incrementStats = function(field) {
  this.stats[field] += 1;
  return this.save();
};

userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

userSchema.statics.findActiveUsers = function() {
  return this.find({ isActive: true }).select('-password -refreshToken');
};

userSchema.statics.findByRole = function(role) {
  return this.find({ role, isActive: true }).select('-password -refreshToken');
};

module.exports = mongoose.model('User', userSchema);