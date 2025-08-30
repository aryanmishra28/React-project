// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
const resumeRoutes = require('./src/routes/resume');
app.use('/api/resume', resumeRoutes);

const hackathonRoutes = require('./src/routes/hackathon');
app.use('/api/hackathon', hackathonRoutes);

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/next-step-app')
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
  res.send('Welcome to the NEXT STEP backend!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});