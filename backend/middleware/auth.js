const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Rate limiting
const authAttempts = new Map();
const MAX_AUTH_ATTEMPTS = 10;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 mins

setInterval(() => {
  const now = Date.now();
  for (const [key, data] of authAttempts.entries()) {
    if (now - data.firstAttempt > RATE_LIMIT_WINDOW) {
      authAttempts.delete(key);
    }
  }
}, 5 * 60 * 1000);

// Error response
const sendAuthError = (res, status, message, code = null) => {
  return res.status(status).json({
    success: false,
    message,
    ...(code && { code }),
    timestamp: new Date().toISOString()
  });
};

// Rate limiter middleware
const rateLimitAuth = (req, res, next) => {
  const clientKey = req.ip + req.get('User-Agent');
  const now = Date.now();

  if (authAttempts.has(clientKey)) {
    const attempts = authAttempts.get(clientKey);
    if (now - attempts.firstAttempt > RATE_LIMIT_WINDOW) {
      authAttempts.delete(clientKey);
    } else if (attempts.count >= MAX_AUTH_ATTEMPTS) {
      return sendAuthError(res, 429, 'Too many authentication attempts. Please try again later.', 'RATE_LIMITED');
    }
  }
  next();
};

// Track failed auth
const trackFailedAuth = (req) => {
  const clientKey = req.ip + req.get('User-Agent');
  const now = Date.now();

  if (authAttempts.has(clientKey)) {
    const attempts = authAttempts.get(clientKey);
    attempts.count += 1;
    attempts.lastAttempt = now;
  } else {
    authAttempts.set(clientKey, { count: 1, firstAttempt: now, lastAttempt: now });
  }
};

// Authenticate middleware
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      trackFailedAuth(req);
      return sendAuthError(res, 401, 'No valid token provided.', 'NO_TOKEN');
    }
    const token = authHeader.substring(7);
    if (!token) {
      trackFailedAuth(req);
      return sendAuthError(res, 401, 'Token is empty.', 'EMPTY_TOKEN');
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET, { issuer: 'trackwise-api', audience: 'trackwise-app' });
    } catch (jwtError) {
      trackFailedAuth(req);
      if (jwtError.name === 'TokenExpiredError') {
        return sendAuthError(res, 401, 'Token expired.', 'TOKEN_EXPIRED');
      }
      if (jwtError.name === 'JsonWebTokenError') {
        return sendAuthError(res, 401, 'Invalid token format.', 'INVALID_TOKEN');
      }
      return sendAuthError(res, 401, 'Token verification failed.', 'VERIFICATION_FAILED');
    }
    if (decoded.type !== 'access') {
      trackFailedAuth(req);
      return sendAuthError(res, 401, 'Access token required.', 'INVALID_TOKEN_TYPE');
    }

    const user = await User.findById(decoded.userId).select('_id name email role isActive lastLogin stats').lean();

    if (!user) {
      trackFailedAuth(req);
      return sendAuthError(res, 401, 'User not found.', 'USER_NOT_FOUND');
    }
    if (!user.isActive) {
      trackFailedAuth(req);
      return sendAuthError(res, 401, 'Account deactivated.', 'ACCOUNT_DEACTIVATED');
    }

    req.user = { userId: user._id, name: user.name, email: user.email, role: user.role, isActive: user.isActive, lastLogin: user.lastLogin, stats: user.stats };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    trackFailedAuth(req);
    return sendAuthError(res, 500, 'Internal server error during authentication.', 'INTERNAL_ERROR');
  }
};

// Admin middleware
const requireAdmin = (req, res, next) => {
  try {
    if (!req.user) return sendAuthError(res, 401, 'Authentication required.', 'NO_AUTH');
    if (req.user.role !== 'admin') return sendAuthError(res, 403, 'Admin access required.', 'INSUFFICIENT_PERMISSIONS');
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return sendAuthError(res, 500, 'Internal server error.', 'INTERNAL_ERROR');
  }
};

// Student middleware
const requireStudent = (req, res, next) => {
  try {
    if (!req.user) return sendAuthError(res, 401, 'Authentication required.', 'NO_AUTH');
    if (req.user.role !== 'student') return sendAuthError(res, 403, 'Student access required.', 'INSUFFICIENT_PERMISSIONS');
    next();
  } catch (error) {
    console.error('Student middleware error:', error);
    return sendAuthError(res, 500, 'Internal server error.', 'INTERNAL_ERROR');
  }
};

// Optional auth middleware
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }
    const token = authHeader.substring(7);
    if (!token) {
      req.user = null;
      return next();
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET, { issuer: 'trackwise-api', audience: 'trackwise-app' });
      if (decoded.type === 'access') {
        const user = await User.findById(decoded.userId).select('_id name email role isActive lastLogin stats').lean();
        req.user = user && user.isActive ? { userId: user._id, name: user.name, email: user.email, role: user.role, isActive: user.isActive, lastLogin: user.lastLogin, stats: user.stats } : null;
      } else {
        req.user = null;
      }
    } catch {
      req.user = null;
    }
    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    req.user = null;
    next();
  }
};

// Validate ownership middleware
const validateOwnership = (req, res, next) => {
  try {
    const { userId } = req.params;
    const authenticatedUserId = req.user.userId.toString();
    if (req.user.role === 'admin') return next();
    if (userId && userId !== authenticatedUserId) return sendAuthError(res, 403, 'Access denied.', 'OWNERSHIP_REQUIRED');
    next();
  } catch (error) {
    console.error('Ownership validation error:', error);
    return sendAuthError(res, 500, 'Internal server error.', 'INTERNAL_ERROR');
  }
};

module.exports = { authenticate, requireAdmin, requireStudent, optionalAuth, validateOwnership, rateLimitAuth };