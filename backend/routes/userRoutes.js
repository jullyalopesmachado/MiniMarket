const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Register user
router.post('/', async (req, res) => {
  try {
    const { name, email, businessName, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 🔹 No need to hash password manually, Mongoose will do it automatically
    const newUser = new User({ 
      name, 
      email, 
      businessName, 
      password // This will be hashed in the pre-save hook
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!', newUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
