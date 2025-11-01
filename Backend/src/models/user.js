const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Password required only if not using Google OAuth
    }
  },
  googleId: {
    type: String,
    sparse: true, // Allows multiple nulls but enforces uniqueness when not null
    unique: true
  },
  picture: {
    type: String
  },
  provider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;