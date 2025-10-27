const express = require('express');
const router = express.Router();

// Import controllers with new OTP/Reset methods
const {
  register,
  verifyOtp,
  login,
  refreshToken,
  logout,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

const {
  authenticate,
  requireAdmin,
  requireStudent,
  validateOwnership,
  rateLimitAuth,
} = require('../middleware/auth');

// --- Input validation middleware ---
const validateRegistration = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || name.trim().length < 2)
    return res.status(400).json({
      success: false,
      message: 'Name must be at least 2 characters',
      field: 'name'
    });
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address',
      field: 'email'
    });
  if (!password || password.length < 6)
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters',
      field: 'password'
    });
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({
      success: false,
      message: 'Email and password are required',
      fields: ['email', 'password']
    });
  next();
};

// --- Auth Public Routes ---
router.post('/register', rateLimitAuth, validateRegistration, register);
router.post('/verify-otp', verifyOtp);            
router.post('/login', rateLimitAuth, validateLogin, login);
router.post('/refresh', rateLimitAuth, refreshToken);

router.post('/forgot-password', forgotPassword); 
router.post('/reset-password', resetPassword);  

// --- Auth Protected Routes ---
router.post('/logout', authenticate, logout);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

// Example: Token verify endpoint (for session check)
router.get('/verify', authenticate, (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Token is valid',
    data: {
      user: {
        userId: req.user.userId,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        isActive: req.user.isActive,
        stats: req.user.stats
      }
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
