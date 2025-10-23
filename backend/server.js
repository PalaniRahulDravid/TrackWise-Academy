const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs/promises');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}
app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  next();
});

// ------- ROUTES -------
const authRoutes = require('./routes/auth');
const roadmapRoutes = require('./routes/roadmap');
const chatRoutes = require('./routes/chat');
const courseRoutes = require('./routes/course');
const dsaRoutes = require('./routes/dsaRoutes');
const companyRoutes = require('./routes/companyRoutes');
const submissionRoutes = require('./routes/submissionRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/dsa', dsaRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/submission', submissionRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'TrackWise Educational Platform API',
    status: 'Active',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    features: {
      authentication: 'Complete user management system',
      roadmaps: 'AI-powered personalized learning paths',
      chat: 'Intelligent AI tutoring and doubt resolution',
      analytics: 'Learning progress tracking',
      dsa: 'DSA practice and company-wise interview questions'
    },
    endpoints: {
      auth: '/api/auth',
      roadmaps: '/api/roadmaps',
      chat: '/api/chat',
      dsa: '/api/dsa',
      company: '/api/company',
      submission: '/api/submission',
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
    features: {
      userAuthentication: 'Active',
      aiRoadmaps: 'Active',
      aiChat: 'Active',
      database: 'Connected',
      dsa: 'Active',
      companyInterviewQuestions: 'Active'
    },
    timestamp: new Date().toISOString()
  });
});

// ------- DATA CACHE -------
const dataCache = { allProblems: [], companyProblems: {} };
async function loadDataCache() {
  try {
    const generalData = await fs.readFile('./data/leetcode_dsa_enriched.json', 'utf-8');
    dataCache.allProblems = JSON.parse(generalData);
    const companies = ['google', 'amazon', 'tcs', 'infosys'];
    for (const company of companies) {
      const cData = await fs.readFile(`./data/company_questions/${company}_questions.json`, 'utf-8');
      dataCache.companyProblems[company] = JSON.parse(cData);
    }
    console.log('✅ DSA and company questions cached in memory');
  } catch (err) {
    console.error('❌ Error loading cached data:', err);
    process.exit(1);
  }
}

// ------- MONGODB CONNECTION -------
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
    app.locals.models = {
      User: require('./models/User'),
      Roadmap: require('./models/Roadmap'),
      Chat: require('./models/Chat')
    };
    await loadDataCache();
    app.locals.dataCache = dataCache;
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

connectDB();

mongoose.connection.on('connected', () => {
  console.log('📊 Mongoose connected to MongoDB');
});
mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});
mongoose.connection.on('disconnected', () => {
  console.log('📊 Mongoose disconnected from MongoDB');
});

// ------- ERROR HANDLING -------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    method: req.method,
    availableEndpoints: {
      auth: '/api/auth/*',
      roadmaps: '/api/roadmaps/*',
      chat: '/api/chat/*',
      dsa: '/api/dsa/*',
      company: '/api/company/*',
      submission: '/api/submission/*'
    },
    timestamp: new Date().toISOString()
  });
});

app.use((err, req, res, next) => {
  console.error('\n=================================');
  console.error('❌ Global Error Handler');
  console.error('URL:', req.originalUrl);
  console.error('Method:', req.method);
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  console.error('=================================\n');
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors,
      timestamp: new Date().toISOString()
    });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid resource ID',
      timestamp: new Date().toISOString()
    });
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
      timestamp: new Date().toISOString()
    });
  }
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
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    timestamp: new Date().toISOString()
  });
});

// ------- SERVER STARTUP -------
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log('\n🚀 ====================================');
  console.log('🎯 TrackWise Educational Platform API v2.0');
  console.log('🚀 ====================================');
  console.log(`🌐 Server: http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ Started: ${new Date().toLocaleString()}`);
  console.log('✅ DSA + Company Questions Fully Integrated!');
});

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
process.on('unhandledRejection', (err, promise) => {
  console.error('❌ Unhandled Promise Rejection:', err.message);
  server.close(() => { process.exit(1); });
});
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  process.exit(1);
});
