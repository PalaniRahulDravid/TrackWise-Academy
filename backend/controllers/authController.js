const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT Token Generation with optimization
const generateTokens = (userId) => {
    const accessToken = jwt.sign(
        { userId, type: 'access' },
        process.env.JWT_SECRET,
        { 
            expiresIn: '15m',
            issuer: 'trackwise-api',
            audience: 'trackwise-app'
        }
    );
    
    const refreshToken = jwt.sign(
        { userId, type: 'refresh' },
        process.env.JWT_SECRET,
        { 
            expiresIn: '7d',
            issuer: 'trackwise-api',
            audience: 'trackwise-app'
        }
    );
    
    return { accessToken, refreshToken };
};

const sendErrorResponse = (res, status, message, details = null) => {
    return res.status(status).json({
        success: false,
        message,
        ...(details && { details }),
        timestamp: new Date().toISOString()
    });
};

const sendSuccessResponse = (res, status, message, data = null) => {
    return res.status(status).json({
        success: true,
        message,
        ...(data && { data }),
        timestamp: new Date().toISOString()
    });
};

// USER REGISTER
const register = async (req, res) => {
    try {
        const { name, email, password, age, education, experience, interests } = req.body;
        if (!name || !email || !password) {
            return sendErrorResponse(res, 400, 'Name, email, and password are required');
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() }).lean();
        if (existingUser) {
            return sendErrorResponse(res, 409, 'User already exists with this email');
        }

        const userData = {
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password,
            profile: {
                ...(age && { age: parseInt(age) }),
                ...(education && { education: education.trim() }),
                ...(experience && { experience }),
                ...(interests && Array.isArray(interests) && { interests })
            }
        };

        const user = new User(userData);
        await user.save();

        const { accessToken, refreshToken } = generateTokens(user._id);
        user.refreshToken = refreshToken;
        await user.save();

        const userResponse = user.toJSON();
        delete userResponse.refreshToken;

        return sendSuccessResponse(res, 201, 'User registered successfully', {
            user: userResponse,
            tokens: { accessToken, refreshToken }
        });
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

// USER LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return sendErrorResponse(res, 400, 'Email and password are required');
        }

        const user = await User.findOne({ email: email.toLowerCase(), isActive: true }).select('+password +refreshToken');
        if (!user) {
            return sendErrorResponse(res, 401, 'Invalid credentials');
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return sendErrorResponse(res, 401, 'Invalid credentials');
        }

        const { accessToken, refreshToken } = generateTokens(user._id);

        user.refreshToken = refreshToken;
        await user.updateLastLogin();

        const userResponse = user.toJSON();
        delete userResponse.refreshToken;

        return sendSuccessResponse(res, 200, 'Login successful', {
            user: userResponse,
            tokens: { accessToken, refreshToken }
        });
    } catch (error) {
        console.error('Login error:', error);
        return sendErrorResponse(res, 500, 'Internal server error during login');
    }
};

// TOKEN REFRESH
const refreshToken = async (req, res) => {
    try {
        const { refreshToken: token } = req.body;
        if (!token) {
            return sendErrorResponse(res, 400, 'Refresh token is required');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.type !== 'refresh') {
            return sendErrorResponse(res, 401, 'Invalid token type');
        }

        const user = await User.findOne({ _id: decoded.userId, refreshToken: token, isActive: true }).lean();
        if (!user) {
            return sendErrorResponse(res, 401, 'Invalid refresh token');
        }

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
        if (!user) {
            return sendErrorResponse(res, 404, 'User not found');
        }
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

        const user = await User.findByIdAndUpdate(userId, filteredUpdates, { new: true, runValidators: true });
        if (!user) {
            return sendErrorResponse(res, 404, 'User not found');
        }
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

module.exports = {
    register,
    login,
    refreshToken,
    logout,
    getProfile,
    updateProfile
};