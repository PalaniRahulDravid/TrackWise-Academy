const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs/promises');
require('dotenv').config();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://track-wise-academy.vercel.app'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser requests like Postman
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Minimal logging to keep terminal clean
app.use((req, res, next) => {
  next();
});

// Security headers
app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  next();
});

// ROUTES
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
    timestamp: new Date().toISOString()
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
      dsa: 'Active (MongoDB)',
      companyQuestions: 'Active (Cache)'
    },
    timestamp: new Date().toISOString()
  });
});

const companyDataCache = { companyProblems: {} };

async function loadCompanyDataCache() {
  try {
    const companies = ['google', 'amazon', 'tcs', 'infosys'];
    for (const company of companies) {
      const cData = await fs.readFile(`./data/company_questions/${company}_questions.json`, 'utf-8');
      companyDataCache.companyProblems[company] = JSON.parse(cData);
    }
    console.log('✅ Company questions cached in memory from GitHub files');
  } catch (err) {
    console.error('❌ Error loading company data:', err);
  }
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    });
    console.log(`🚀 Connected to MongoDB: ${conn.connection.name} @ ${conn.connection.host}`);
    
    app.locals.models = {
      User: require('./models/User'),
      Roadmap: require('./models/Roadmap'),
      Chat: require('./models/Chat')
    };
    
    await loadCompanyDataCache();
    app.locals.dataCache = companyDataCache;
    
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    process.exit(1);
  }
};

connectDB();

mongoose.connection.on('error', (err) => console.error('🔴 Mongoose error:', err));
mongoose.connection.on('disconnected', () => console.log('🟠 Mongoose disconnected'));

app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.originalUrl} not found` 
  });
});

app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});
process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err.message);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
  process.exit(1);
});
