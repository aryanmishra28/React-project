// index.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());


// Import authentication routes
const authRoutes = require('./routes/auth');

// Use authentication routes
app.use('/api/auth', authRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Welcome to the NEXT STEP backend!');
});

// Start the server
module.exports = app;