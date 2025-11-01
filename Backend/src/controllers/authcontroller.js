const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

// Register a new user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'All fields are required' 
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists' 
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({ 
      name, 
      email: normalizedEmail, 
      password: hashedPassword 
    });

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    res.status(201).json({ 
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Something went wrong', 
      error: error.message 
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required' 
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // Find user
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    res.json({ 
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Something went wrong', 
      error: error.message 
    });
  }
};

// Logout user
const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ 
      success: true,
      message: 'Logged out successfully' 
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Something went wrong' 
    });
  }
};

// Google OAuth login
const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ 
        success: false,
        message: 'ID token is required' 
      });
    }

    // Verify Google ID token using Google's API
    const fetch = require('node-fetch');
    const googleResponse = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
    const googleData = await googleResponse.json();

    if (!googleResponse.ok || googleData.error) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid Google token' 
      });
    }

    // Extract user info from Google
    const { email, name, picture, sub: googleId } = googleData;
    const normalizedEmail = String(email).trim().toLowerCase();

    // Check if user exists
    let user = await User.findOne({ 
      $or: [
        { email: normalizedEmail },
        { googleId: googleId }
      ]
    });

    if (!user) {
      // Create new user with Google OAuth
      user = await User.create({
        name: name || email.split('@')[0],
        email: normalizedEmail,
        googleId: googleId,
        picture: picture,
        provider: 'google',
        password: undefined // No password for OAuth users
      });
    } else {
      // Update existing user with Google info if needed
      if (!user.googleId) {
        user.googleId = googleId;
        user.provider = 'google';
        if (!user.picture && picture) {
          user.picture = picture;
        }
        await user.save();
      }
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    res.json({ 
      success: true,
      message: 'Logged in successfully with Google',
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        picture: user.picture
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Something went wrong', 
      error: error.message 
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  googleLogin
};