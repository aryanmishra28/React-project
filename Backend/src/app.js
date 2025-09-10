// Ensure this file does NOT call app.listen
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const resumeRoutes = require('./routes/resume');
const hackathonRoutes = require('./routes/hackathon');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'], credentials: true }));

// Routes with /api prefix to match frontend
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/hackathon', hackathonRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Welcome to the NEXT STEP backend!');
});

// DB connect (use consistent env name)
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env');
  process.exit(1);
}
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

module.exports = app;