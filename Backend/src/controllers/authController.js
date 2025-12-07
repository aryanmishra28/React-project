const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const fetch = require("node-fetch"); // Required in Node 22 for Google API + OpenAI
require("dotenv").config();

/* ------------------------ HELPER: CREATE JWT TOKEN ------------------------ */
function generateToken(userId) {
  if (!process.env.JWT_SECRET) {
    console.error("❌ JWT_SECRET is missing in Render environment variables!");
    return null;
  }

  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
}

/* ----------------------------- REGISTER USER ------------------------------ */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
    });

    // Create token
    const token = generateToken(user._id);
    if (!token) {
      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
    }

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

/* -------------------------------- LOGIN ---------------------------------- */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "This account only supports Google login",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });

    const token = generateToken(user._id);
    if (!token) {
      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
    }

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.json({
      success: true,
      message: "Logged in successfully",
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

/* -------------------------------- LOGOUT --------------------------------- */
const logout = (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* ---------------------------- GOOGLE LOGIN ------------------------------- */
const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "ID token is required",
      });
    }

    const googleResponse = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
    );

    const googleData = await googleResponse.json();

    if (!googleResponse.ok || googleData.error) {
      return res.status(400).json({
        success: false,
        message: "Invalid Google token",
      });
    }

    const { email, name, picture, sub: googleId } = googleData;
    const normalizedEmail = String(email).trim().toLowerCase();

    let user = await User.findOne({
      $or: [{ email: normalizedEmail }, { googleId }],
    });

    if (!user) {
      user = await User.create({
        name: name || normalizedEmail.split("@")[0],
        email: normalizedEmail,
        googleId,
        picture,
        provider: "google",
      });
    } else {
      if (!user.googleId) {
        user.googleId = googleId;
        user.provider = "google";
        if (picture && !user.picture) user.picture = picture;
        await user.save();
      }
    }

    const token = generateToken(user._id);
    if (!token) {
      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
    }

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.json({
      success: true,
      message: "Google login successful",
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        picture: user.picture,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

/* ----------------------------- EXPORT MODULES ----------------------------- */
module.exports = {
  register,
  login,
  logout,
  googleLogin,
};
