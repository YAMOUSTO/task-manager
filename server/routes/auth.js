const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User'); 

// Middleware for protecting routes
const authMiddleware = require('../middleware/authMiddleware');


router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'Please enter name, email, and password' });
  }
  if (password.length < 6) {
    return res.status(400).json({ msg: 'Password must be at least 6 characters' });
  }

  try {
    let existingUser = await User.findOne({ email: email.toLowerCase() }); 
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists with this email' });
    }
    const newUser = new User({
      name,
      email: email.toLowerCase(),
    });

    const salt = await bcrypt.genSalt(10);
    newUser.passwordHash = await bcrypt.hash(password, salt);

    await newUser.save(); 

    const payload = {
      user: {
        id: newUser.id, 
        email: newUser.email,
        name: newUser.name,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          token,
          user: { 
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
          },
        });
      }
    );
  } catch (err) {
    console.error('Registration Error:', err.message);
    if (err.code === 11000) { 
        return res.status(400).json({ msg: 'User already exists with this email (DB constraint).' });
    }
    res.status(500).send('Server error during registration');
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Please enter email and password' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials (user not found)' });
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials (password mismatch)' });
    }
    const payload = {
      user: {
        id: user.id, 
        email: user.email,
        name: user.name,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        });
      }
    );
  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).send('Server error during login');
  }
});

router.put('/change-password', authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id; 

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ msg: 'Please provide current and new passwords.' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ msg: 'New password must be at least 6 characters.' });
  }
  if (currentPassword === newPassword) {
    return res.status(400).json({ msg: 'New password cannot be the same as the current password.' });
  }

  try {

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found.' }); 
    }
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Incorrect current password.' });
    }
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ msg: 'Password changed successfully.' });
  } catch (err) {
    console.error('Change Password Error:', err.message);
    res.status(500).send('Server error during password change.');
  }
});

module.exports = router;