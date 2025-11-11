const express = require('express');
const router = express.Router();

const {
  register,
  verifyOtp,
  resendOtp,
  login,
  refreshToken,
  logout,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
  getGameSessionStatus,
  startGameSession,
  endGameSession
} = require('../controllers/authController');

const {
  authenticate,
  requireAdmin,
  requireStudent,
  validateOwnership,
  rateLimitAuth,
} = require('../middleware/auth');

// --- Input validation middleware (your existing ones) ---
const validateRegistration = (req, res, next) => {
  // your validation logic here
  next();
};

const validateLogin = (req, res, next) => {
  // your validation logic here
  next();
};

// --- Auth Public Routes ---
router.post('/register', validateRegistration, register); // Removed rate limiting for registration
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/login', rateLimitAuth, validateLogin, login);
router.post('/refresh', refreshToken); // Removed rate limiting for refresh
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// --- Auth Protected Routes ---
router.post('/logout', authenticate, logout);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

// Game session routes
router.get('/games/session/status', authenticate, getGameSessionStatus);
router.post('/games/session/start', authenticate, startGameSession);
router.post('/games/session/end', authenticate, endGameSession);

// Token verify endpoint (optional)
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
