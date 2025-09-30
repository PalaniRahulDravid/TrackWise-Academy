const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// =================================
// MIDDLEWARE CONFIGURATION
// =================================

// CORS Configuration - Allow frontend connections
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware (development)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });
}

// Security headers middleware
app.use((req, res, next) => {
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-Frame-Options', 'DENY');
    res.header('X-XSS-Protection', '1; mode=block');
    next();
});

// =================================
// ROUTES CONFIGURATION
// =================================

// Import route modules
const authRoutes = require('./routes/auth');
const roadmapRoutes = require('./routes/roadmap');

// Health check and root routes
app.get('/', (req, res) => {
    res.json({ 
        message: 'TrackWise Educational Platform API',
        status: 'Active',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        endpoints: {
            auth: '/api/auth',
            roadmaps: '/api/roadmaps',
            health: '/health'
        }
    });
});

app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK',
        service: 'TrackWise Backend',
        uptime: Math.floor(process.uptime()),
        memory: {
            used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
            total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100
        },
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/roadmaps', roadmapRoutes);

// API Information endpoint
app.get('/api', (req, res) => {
    res.json({
        message: 'TrackWise API v1.0.0',
        documentation: 'https://github.com/PalaniRahulDravid/TrackWise-Academy',
        endpoints: {
            authentication: {
                register: 'POST /api/auth/register',
                login: 'POST /api/auth/login',
                refresh: 'POST /api/auth/refresh',
                logout: 'POST /api/auth/logout',
                profile: 'GET /api/auth/profile',
                updateProfile: 'PUT /api/auth/profile',
                verify: 'GET /api/auth/verify'
            },
            roadmaps: {
                generate: 'POST /api/roadmaps/generate',
                getAll: 'GET /api/roadmaps',
                getById: 'GET /api/roadmaps/:roadmapId',
                updateProgress: 'PUT /api/roadmaps/:roadmapId/progress',
                delete: 'DELETE /api/roadmaps/:roadmapId'
            },
            admin: {
                getAllUsers: 'GET /api/auth/users',
                toggleUserStatus: 'PUT /api/auth/users/:userId/toggle'
            }
        },
        timestamp: new Date().toISOString()
    });
});

// =================================
// DATABASE CONNECTION
// =================================

// MongoDB Connection with optimized settings
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4
        });
        
        console.log('\n=================================');
        console.log('✅ MongoDB Connected Successfully');
        console.log(`📡 Database: ${conn.connection.name}`);
        console.log(`🌐 Host: ${conn.connection.host}`);
        console.log(`⚡ Connection State: ${conn.connection.readyState}`);
        console.log('=================================\n');
        
    } catch (error) {
        console.error('\n=================================');
        console.error('❌ MongoDB Connection Failed');
        console.error('Error:', error.message);
        console.error('=================================\n');
        
        setTimeout(() => {
            process.exit(1);
        }, 1000);
    }
};

// Connect to database
connectDB();

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
    console.log('📊 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('📊 Mongoose disconnected from MongoDB');
});

// =================================
// ERROR HANDLING MIDDLEWARE
// =================================

// 404 Handler - Must be after all routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
        method: req.method,
        timestamp: new Date().toISOString()
    });
});

// Global Error Handler - Must be last middleware
app.use((err, req, res, next) => {
    console.error('\n=================================');
    console.error('❌ Global Error Handler');
    console.error('URL:', req.originalUrl);
    console.error('Method:', req.method);
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
    console.error('=================================\n');
    
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors,
            timestamp: new Date().toISOString()
        });
    }
    
    // Mongoose CastError
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: 'Invalid resource ID',
            timestamp: new Date().toISOString()
        });
    }
    
    // MongoDB duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(409).json({
            success: false,
            message: `${field} already exists`,
            timestamp: new Date().toISOString()
        });
    }
    
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Invalid token',
            timestamp: new Date().toISOString()
        });
    }
    
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token expired',
            timestamp: new Date().toISOString()
        });
    }
    
    // Default error
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
        timestamp: new Date().toISOString()
    });
});

// =================================
// SERVER STARTUP
// =================================

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log('\n🚀 ====================================');
    console.log('🎯 TrackWise Educational Platform API');
    console.log('🚀 ====================================');
    console.log(`🌐 Server: http://localhost:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`⏰ Started: ${new Date().toLocaleString()}`);
    console.log('📋 Available Endpoints:');
    console.log('   📍 GET  / - API Information');
    console.log('   📍 GET  /health - Health Check');
    console.log('   📍 POST /api/auth/register - User Registration');
    console.log('   📍 POST /api/auth/login - User Login');
    console.log('   📍 GET  /api/auth/profile - User Profile');
    console.log('   📍 POST /api/roadmaps/generate - Generate Roadmap');
    console.log('   📍 GET  /api/roadmaps - Get User Roadmaps');
    console.log('🚀 ====================================\n');
});

// =================================
// GRACEFUL SHUTDOWN
// =================================

process.on('SIGTERM', () => {
    console.log('\n🔄 SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('✅ Process terminated');
        mongoose.connection.close(false, () => {
            console.log('📊 MongoDB connection closed');
            process.exit(0);
        });
    });
});

process.on('SIGINT', () => {
    console.log('\n🔄 SIGINT received, shutting down gracefully');
    server.close(() => {
        console.log('✅ Process terminated');
        mongoose.connection.close(false, () => {
            console.log('📊 MongoDB connection closed');
            process.exit(0);
        });
    });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.error('❌ Unhandled Promise Rejection:', err.message);
    server.close(() => {
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err.message);
    process.exit(1);
});
