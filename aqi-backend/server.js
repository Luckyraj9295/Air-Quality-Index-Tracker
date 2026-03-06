// AQI Environmental Intelligence Dashboard - Backend Server
// Main server entry point

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cron = require('node-cron');

// Load environment variables FIRST, before requiring services that use process.env
dotenv.config();

// NOW require modules that depend on environment variables
const { collectAQI } = require('./cron/collectAQI');

// Verify environment variables are loaded
console.log('📋 Environment Variables Loaded:');
console.log(`   PORT: ${process.env.PORT}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`   MONGODB_URI: ${process.env.MONGODB_URI ? '✅ Configured' : '❌ Missing'}`);
console.log(`   WAQI_API_KEY: ${process.env.WAQI_API_KEY ? '✅ ' + process.env.WAQI_API_KEY.substring(0, 10) + '...' : '❌ Missing'}`);
console.log('');
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/aqi', require('./routes/aqiRoutes'));
app.use('/api/plants', require('./routes/plantRoutes'));
app.use('/api/prediction', require('./routes/predictionRoutes'));
app.use('/api/exposure-risk', require('./routes/exposureRiskRoutes'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'AQI Dashboard Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'AQI Environmental Intelligence Dashboard API',
    version: '1.0.0',
    endpoints: {
      aqi: '/api/aqi/:city',
      history: '/api/aqi/history/:city',
      prediction: '/api/prediction/:city',
      plants: '/api/plants/recommend',
      exposureRisk: '/api/exposure-risk',
      health: '/health'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: 'Endpoint not found',
      status: 404
    }
  });
});

// Schedule cron job to collect AQI data daily at midnight
// Runs every day at 00:00
cron.schedule('0 0 * * *', () => {
  console.log('🕐 Running daily AQI collection job...');
  collectAQI();
}, {
  timezone: "UTC"
});

// Also run on server startup to ensure we have recent data (with delay for DB connection)
setTimeout(async () => {
  console.log('🔄 Running initial AQI collection...');
  try {
    await collectAQI();
  } catch (error) {
    console.error('❌ Initial AQI collection failed:', error.message);
  }
}, 2000);

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ Daily AQI collection scheduled for 00:00 UTC`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

module.exports = app;
