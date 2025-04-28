const express = require("express");
const Business = require("../models/Business");
const User = require("../models/User");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

// ✅ Add a new business (Protected Route)
router.post('/add', authMiddleware(["user"]), async (req, res) => {
  try {
    const { email, phone, description, location, website } = req.body;
    console.log("📦 Incoming body:", req.body);

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.businessName) {
      return res.status(400).json({ message: "User is missing required fields (businessName)" });
    }

    if (!description || !location || !email || !phone) {
      return res.status(400).json({ message: "Missing required fields (description, location, email, or phone)" });
    }

    console.log("👤 Owner from token:", user);

    const newBusiness = new Business({
      owner: user._id,
      name: user.businessName,
      description,
      location,
      website,
      contact: {
        email: email,
        phone: phone,
      },
    });

    console.log("New Business:", newBusiness);

    await newBusiness.save();

    // ✅ Upgrade user role to "owner"
    await User.updateOne(
      { _id: req.user._id },
      { $set: { role: 'owner' } }
    );

    console.log("✅ Business saved:", newBusiness);
    res.status(201).json({ message: "Business created successfully", newBusiness });

  } catch (err) {
    console.error("❌ Error creating business:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
