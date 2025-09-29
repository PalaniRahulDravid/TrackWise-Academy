const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic test route
app.get('/', (req, res) => {
    res.json({ 
        message: 'TrackWise Backend Server Running!',
        status: 'Success',
        timestamp: new Date().toISOString()
    });
});

// Health check route
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        uptime: process.uptime(),
        memory: process.memoryUsage()
    });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected successfully');
        console.log('Database: TrackWise_DB');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
    });

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`TrackWise Server running on port ${PORT}`);
    console.log(`Access: http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});