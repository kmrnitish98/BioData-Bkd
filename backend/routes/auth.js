const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'This email is already registered' });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
    });
  } catch (err) {
    console.error('[Auth] signup error:', err.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
    });
  } catch (err) {
    console.error('[Auth] login error:', err.message);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// POST /api/auth/google
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'No Google token provided' });

    const { OAuth2Client } = require('google-auth-library');
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture: avatar } = payload;

    let user = await User.findOne({ email });
    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        if (!user.avatar) user.avatar = avatar;
        await user.save();
      }
    } else {
      user = await User.create({ name, email, googleId, avatar });
    }

    res.json({
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
    });
  } catch (err) {
    console.error('[Auth] google login error:', err.message);
    res.status(500).json({ message: 'Google login failed' });
  }
});

// POST /api/auth/facebook
router.post('/facebook', async (req, res) => {
  try {
    const { accessToken } = req.body;
    if (!accessToken) return res.status(400).json({ message: 'No Facebook token provided' });

    const axios = require('axios');
    const { data } = await axios.get(`https://graph.facebook.com/me`, {
      params: {
        fields: 'id,name,email,picture.type(large)',
        access_token: accessToken,
      },
    });

    const { id: facebookId, email, name, picture } = data;
    if (!email) {
      return res.status(400).json({ message: 'Facebook account must have an email associated' });
    }

    const avatar = picture?.data?.url;

    let user = await User.findOne({ email });
    if (user) {
      if (!user.facebookId) {
        user.facebookId = facebookId;
        if (!user.avatar && avatar) user.avatar = avatar;
        await user.save();
      }
    } else {
      user = await User.create({ name, email, facebookId, avatar });
    }

    res.json({
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
    });
  } catch (err) {
    console.error('[Auth] facebook login error:', err.message);
    res.status(500).json({ message: 'Facebook login failed' });
  }
});

// GET /api/auth/me  — validate token and return current user
router.get('/me', require('../middleware/auth').protect, (req, res) => {
  const u = req.user;
  res.json({ id: u._id, name: u.name, email: u.email, avatar: u.avatar });
});

module.exports = router;
