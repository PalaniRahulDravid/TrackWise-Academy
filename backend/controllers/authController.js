const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendVerificationEmail, sendResetPasswordEmail } = require('../utils/email');

// JWT Generation
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId, type: 'access' },
    process.env.JWT_SECRET,
    { expiresIn: '15m', issuer: 'trackwise-api', audience: 'trackwise-app' }
  );
  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_SECRET,
    { expiresIn: '7d', issuer: 'trackwise-api', audience: 'trackwise-app' }
  );
  return { accessToken, refreshToken };
};

const sendErrorResponse = (res, status, message, details = null) => {
  return res.status(status).json({
    success: false, message, ...(details && { details }),
    timestamp: new Date().toISOString()
  });
};
const sendSuccessResponse = (res, status, message, data = null) => {
  return res.status(status).json({
    success: true, message, ...(data && { data }),
    timestamp: new Date().toISOString()
  });
};

// REGISTER - sends OTP (email)
const register = async (req, res) => {
  try {
    const { name, email, password, age, education, experience, interests } = req.body;
    if (!name || !email || !password)
      return sendErrorResponse(res, 400, 'Name, email, and password are required');
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser)
      return sendErrorResponse(res, 409, 'User already exists with this email');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      isVerified: false,
      otpToken: otp,
      otpExpires,
      profile: {
        ...(age && { age: parseInt(age) }),
        ...(education && { education: education.trim() }),
        ...(experience && { experience }),
        ...(interests && Array.isArray(interests) && { interests }),
      }
    });
    await user.save();
    sendVerificationEmail(user.email, otp).catch(console.error);
    return sendSuccessResponse(res, 201, 'Registered! OTP sent to your email for verification.');
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000)
      return sendErrorResponse(res, 409, 'Email already registered');
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return sendErrorResponse(res, 400, 'Validation failed', validationErrors);
    }
    return sendErrorResponse(res, 500, 'Internal server error during registration');
  }
};

// OTP VERIFY
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return sendErrorResponse(res, 400, 'Email and OTP are required');
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return sendErrorResponse(res, 404, 'User not found');
    if (user.isVerified)
      return sendErrorResponse(res, 400, 'Already verified');
    if (!user.otpToken || !user.otpExpires || user.otpExpires < new Date())
      return sendErrorResponse(res, 400, 'OTP expired. Request a new one.');
    if (user.otpToken !== otp)
      return sendErrorResponse(res, 400, 'Invalid OTP');
    user.isVerified = true;
    user.otpToken = undefined;
    user.otpExpires = undefined;
    await user.save();
    return sendSuccessResponse(res, 200, 'Email verified! You can now login.');
  } catch (error) {
    console.error('OTP verification error:', error);
    return sendErrorResponse(res, 500, 'Internal server error during OTP verification');
  }
};

// LOGIN - blocks unverified
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return sendErrorResponse(res, 400, 'Email and password are required');
    const user = await User.findOne({ email: email.toLowerCase(), isActive: true }).select('+password +refreshToken +isVerified');
    if (!user)
      return sendErrorResponse(res, 401, 'Invalid credentials');
    if (!user.isVerified)
      return sendErrorResponse(res, 403, 'Email not verified. Please verify before login.');
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid)
      return sendErrorResponse(res, 401, 'Invalid credentials');
    const tokens = generateTokens(user._id);
    user.refreshToken = tokens.refreshToken;
    await user.updateLastLogin();
    await user.save();
    const userResponse = user.toJSON();
    delete userResponse.refreshToken;
    return sendSuccessResponse(res, 200, 'Login successful', { user: userResponse, tokens });
  } catch (error) {
    console.error('Login error:', error);
    return sendErrorResponse(res, 500, 'Internal server error during login');
  }
};

// TOKEN REFRESH
const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;
    if (!token) return sendErrorResponse(res, 400, 'Refresh token is required');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== 'refresh')
      return sendErrorResponse(res, 401, 'Invalid token type');
    const user = await User.findOne({ _id: decoded.userId, refreshToken: token, isActive: true }).lean();
    if (!user) return sendErrorResponse(res, 401, 'Invalid refresh token');
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);
    await User.findByIdAndUpdate(user._id, { refreshToken: newRefreshToken, lastLogin: new Date() });
    return sendSuccessResponse(res, 200, 'Token refreshed successfully', {
      tokens: { accessToken, refreshToken: newRefreshToken }
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return sendErrorResponse(res, 401, 'Invalid or expired refresh token');
    }
    return sendErrorResponse(res, 500, 'Internal server error during token refresh');
  }
};

// USER LOGOUT
const logout = async (req, res) => {
  try {
    const { userId } = req.user;
    await User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });
    return sendSuccessResponse(res, 200, 'Logout successful');
  } catch (error) {
    console.error('Logout error:', error);
    return sendErrorResponse(res, 500, 'Internal server error during logout');
  }
};

// GET USER PROFILE
const getProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId).lean();
    if (!user) return sendErrorResponse(res, 404, 'User not found');
    return sendSuccessResponse(res, 200, 'Profile retrieved successfully', { user });
  } catch (error) {
    console.error('Get profile error:', error);
    return sendErrorResponse(res, 500, 'Internal server error');
  }
};

// UPDATE USER PROFILE
const updateProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const updates = req.body;
    const allowedUpdates = ['name', 'profile'];
    const filteredUpdates = {};
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });
    const user = await User.findByIdAndUpdate(
      userId,
      filteredUpdates,
      { new: true, runValidators: true }
    );
    if (!user) return sendErrorResponse(res, 404, 'User not found');
    return sendSuccessResponse(res, 200, 'Profile updated successfully', { user });
  } catch (error) {
    console.error('Update profile error:', error);
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return sendErrorResponse(res, 400, 'Validation failed', validationErrors);
    }
    return sendErrorResponse(res, 500, 'Internal server error');
  }
};

// FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return sendErrorResponse(res, 400, 'Email is required');
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return sendErrorResponse(res, 404, 'User not found');
    if (!user.isVerified)
      return sendErrorResponse(res, 403, 'Email not verified');
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.resetToken = resetToken;
    user.resetTokenExpires = resetTokenExpires;
    await user.save();
    sendResetPasswordEmail(user.email, resetToken).catch(console.error);
    return sendSuccessResponse(res, 200, 'Reset password email sent');
  } catch (error) {
    console.error('Forgot password error:', error);
    return sendErrorResponse(res, 500, 'Internal server error during forgot password');
  }
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword)
      return sendErrorResponse(res, 400, 'Token and new password required');
    const user = await User.findOne({ resetToken: token, resetTokenExpires: { $gt: new Date() } }).select('+password');
    if (!user)
      return sendErrorResponse(res, 400, 'Invalid or expired token');
    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();
    return sendSuccessResponse(res, 200, 'Password reset successful! Please login now.');
  } catch (error) {
    console.error('Reset password error:', error);
    return sendErrorResponse(res, 500, 'Internal server error during reset password');
  }
};

module.exports = {
  register,
  verifyOtp,
  login,
  refreshToken,
  logout,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword
};
