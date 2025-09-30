const express = require('express');
const router = express.Router();

// Import controllers and middleware
const {
    register,
    login,
    refreshToken,
    logout,
    getProfile,
    updateProfile
} = require('../controllers/authController');

const {
    authenticate,
    requireAdmin,
    requireStudent,
    validateOwnership,
    rateLimitAuth
} = require('../middleware/auth');

// Input validation middleware (basic - can be enhanced with express-validator)
const validateRegistration = (req, res, next) => {
    const { name, email, password } = req.body;
    
    if (!name || name.trim().length < 2) {
        return res.status(400).json({
            success: false,
            message: 'Name must be at least 2 characters long',
            field: 'name'
        });
    }
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a valid email address',
            field: 'email'
        });
    }
    
    if (!password || password.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 6 characters long',
            field: 'password'
        });
    }
    
    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required',
            fields: ['email', 'password']
        });
    }
    
    next();
};

// =================================
// PUBLIC AUTHENTICATION ROUTES
// =================================

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (Student by default)
 * @access  Public
 * @body    { name, email, password, age?, education?, experience?, interests? }
 */
router.post('/register', 
    rateLimitAuth,
    validateRegistration,
    register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and get access tokens
 * @access  Public
 * @body    { email, password }
 */
router.post('/login', 
    rateLimitAuth,
    validateLogin,
    login
);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token using refresh token
 * @access  Public
 * @body    { refreshToken }
 */
router.post('/refresh', 
    rateLimitAuth,
    refreshToken
);

// =================================
// PROTECTED AUTHENTICATION ROUTES
// =================================

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user and invalidate refresh token
 * @access  Private
 * @headers Authorization: Bearer <access_token>
 */
router.post('/logout', 
    authenticate,
    logout
);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 * @headers Authorization: Bearer <access_token>
 */
router.get('/profile', 
    authenticate,
    getProfile
);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update current user profile
 * @access  Private
 * @headers Authorization: Bearer <access_token>
 * @body    { name?, profile: { age?, education?, experience?, interests? } }
 */
router.put('/profile', 
    authenticate,
    updateProfile
);

/**
 * @route   GET /api/auth/profile/:userId
 * @desc    Get specific user profile (Admin or own profile)
 * @access  Private
 * @headers Authorization: Bearer <access_token>
 */
router.get('/profile/:userId', 
    authenticate,
    validateOwnership,
    async (req, res) => {
        try {
            const { userId } = req.params;
            const User = require('../models/User');
            
            const user = await User.findById(userId).lean();
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found',
                    timestamp: new Date().toISOString()
                });
            }
            
            return res.status(200).json({
                success: true,
                message: 'User profile retrieved successfully',
                data: { user },
                timestamp: new Date().toISOString()
            });
            
        } catch (error) {
            console.error('Get user profile error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                timestamp: new Date().toISOString()
            });
        }
    }
);

// =================================
// ADMIN ONLY ROUTES
// =================================

/**
 * @route   GET /api/auth/users
 * @desc    Get all users (Admin only)
 * @access  Private (Admin)
 * @headers Authorization: Bearer <access_token>
 * @query   page?, limit?, role?, search?
 */
router.get('/users', 
    authenticate,
    requireAdmin,
    async (req, res) => {
        try {
            const { 
                page = 1, 
                limit = 10, 
                role, 
                search,
                sortBy = 'createdAt',
                sortOrder = 'desc'
            } = req.query;
            
            const User = require('../models/User');
            
            // Build query
            const query = { isActive: true };
            
            if (role && ['student', 'admin'].includes(role)) {
                query.role = role;
            }
            
            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ];
            }
            
            // Build sort
            const sort = {};
            sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
            
            // Execute queries
            const [users, total] = await Promise.all([
                User.find(query)
                    .select('-refreshToken -passwordResetToken')
                    .sort(sort)
                    .skip((page - 1) * limit)
                    .limit(parseInt(limit))
                    .lean(),
                User.countDocuments(query)
            ]);
            
            return res.status(200).json({
                success: true,
                message: 'Users retrieved successfully',
                data: {
                    users,
                    pagination: {
                        current: parseInt(page),
                        total: Math.ceil(total / limit),
                        count: users.length,
                        totalRecords: total
                    }
                },
                timestamp: new Date().toISOString()
            });
            
        } catch (error) {
            console.error('Get users error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                timestamp: new Date().toISOString()
            });
        }
    }
);

/**
 * @route   PUT /api/auth/users/:userId/toggle
 * @desc    Toggle user active status (Admin only)
 * @access  Private (Admin)
 * @headers Authorization: Bearer <access_token>
 */
router.put('/users/:userId/toggle', 
    authenticate,
    requireAdmin,
    async (req, res) => {
        try {
            const { userId } = req.params;
            const User = require('../models/User');
            
            const user = await User.findById(userId);
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found',
                    timestamp: new Date().toISOString()
                });
            }
            
            // Prevent admin from deactivating themselves
            if (user._id.toString() === req.user.userId.toString()) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot deactivate your own account',
                    timestamp: new Date().toISOString()
                });
            }
            
            user.isActive = !user.isActive;
            await user.save();
            
            return res.status(200).json({
                success: true,
                message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
                data: { 
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        isActive: user.isActive
                    }
                },
                timestamp: new Date().toISOString()
            });
            
        } catch (error) {
            console.error('Toggle user status error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                timestamp: new Date().toISOString()
            });
        }
    }
);

// =================================
// UTILITY ROUTES
// =================================

/**
 * @route   GET /api/auth/verify
 * @desc    Verify if token is valid
 * @access  Private
 * @headers Authorization: Bearer <access_token>
 */
router.get('/verify', 
    authenticate,
    (req, res) => {
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
    }
);

module.exports = router;
