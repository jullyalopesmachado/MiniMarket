const express = require("express");
const Business = require("../models/Business");
const User = require("../models/User"); // Import User model
const router = express.Router();
const authMiddleware = require("../middleware/auth");

// Add a new business (Protected Route)
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { name, description, location, email, website } = req.body;
    const owner = req.user._id;

    console.log("📦 Incoming body:", req.body);
    console.log("👤 Owner from token:", owner);

    if (!name || !location || !email || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newBusiness = new Business({
      owner,
      name,
      description,
      location,
      email,
      website
    });

    console.log("New Business:", newBusiness); // Debugging log

    await newBusiness.save();
    console.log("✅ Business saved:", newBusiness);
    res.status(201).json({ message: "Business created successfully", newBusiness });

  } catch (err) {
    console.error("❌ Error creating business:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Get All Users or Search Users
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    let businesses;

    if (search) {
      businesses = await Business.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { owner: { $regex: search, $options: "i" } },
          { industry: { $regex: search, $options: "i" } },
          { "address.city": { $regex: search, $options: "i" } },
        ]
      });
    } else {
      businesses = await Business.find();
    }

    res.json(businesses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(business);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, description, website, location, email } = req.body;

    const business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    const requestingUser = req.user;
    if (
      business.owner_id.toString() !== requestingUser._id.toString() &&
      !requestingUser.isAdmin
    ) {
      console.log("💬 Owner ID in DB:", business.owner_id);
      console.log("🔐 Requesting user ID:", requestingUser._id);
      return res.status(403).json({ message: "Not authorized" });
    }

    if (name) business.name = name;
    if (description) business.description = description;
    if (website) business.website = website;
    if (location) business.location = location;
    if (email) business.email = email;

    await business.save();
    res.status(200).json({ message: "Business updated successfully", business });
  } catch (error) {
    console.error("❌ Error saving business:", error);
    res.status(400).json({ message: "Failed to update business", error });
  }
});

module.exports = router;