const express = require("express");
const Business = require("../models/Business");
const User = require("../models/User"); // Import User model
const router = express.Router();
const authMiddleware = require("../middleware/auth");

// Add a new business (Protected Route)
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { industry, address, contact, website } = req.body;
    
    // 🔹 Get user ID from decoded token
    const userId = req.user._id; 

    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!industry || !contact || !contact.phone || !contact.email) {
      return res.status(400).json({ message: "Industry and contact information are required" });
    }

    // Create a new business record
    const newBusiness = new Business({
      user: userId,
      industry,
      address,
      contact,
      website,
    });

    await newBusiness.save();
    res.status(201).json({ message: "Business added successfully", newBusiness });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
