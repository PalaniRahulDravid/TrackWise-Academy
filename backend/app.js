const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- Middlewares ---
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// --- Standard logging ---
if(process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// --- Security Headers ---
app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  next();
});

// --- Feature Routes ---
const authRoutes = require('./routes/auth');
const roadmapRoutes = require('./routes/roadmap');
const chatRoutes = require('./routes/chat');
const courseRoutes = require('./routes/course');
const dsaRoutes = require('./routes/dsa'); // <-- YOUR NEW DSA FEATURE ROUTE
const companyRoutes = require('./routes/companyRoutes'); // <-- COMPANY QUESTIONS ROUTE

app.use('/api/auth', authRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/dsa', dsaRoutes);
app.use('/api/company', companyRoutes);

// --- Health and info endpoints ---
app.get('/', (req, res) => { /* ... as before ... */ });
app.get('/health', (req, res) => { /* ... as before ... */ });

// --- 404 and global error handling (move to app.js for modularity) ---
app.use((req, res) => { /* ... as before ... */ });
app.use((err, req, res, next) => { /* ... as before ... */ });

module.exports = app;
