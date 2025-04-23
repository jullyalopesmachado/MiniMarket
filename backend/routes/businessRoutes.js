const express = require("express");
const Business = require("../models/Business");
const User = require("../models/User"); // Import User model
const router = express.Router();
const authMiddleware = require("../middleware/auth");

// Add a new business (Protected Route)
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const {description, location, website } = req.body;
    

    const user = await User.findById(req.user._id);
            if (!user) {
              return res.status(404).json({ message: 'User not found' });
            }


            if (!user.businessName || !user.email) {
              return res.status(400).json({ message: "User is missing required fields (businessName or email)" });
            }
        
            // Validate the request body
            if (!description || !location) {
              return res.status(400).json({ message: "Missing required fields" });
            }
          
    console.log("👤 Owner from token:", user);
    console.log("📦 Incoming body:", req.body);
    console.log("📦 User email and business:", user.email); // Debugging log

    const newBusiness = new Business({
      owner: user._id,
      name: user.businessName,
      description,
      location,
      email: user.email,
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

// ✅ Get All Businesses (with search functionality)
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

router.get("/owned", authMiddleware(["owner", "admin"]), async (req, res) => {
  try {
    // Find the business associated with the authenticated user
    const business = await Business.findOne({ owner: req.user._id });
    
    if (!business) {
      return res.status(404).json({ message: "No business found for this user" });
    }

    res.status(200).json(business);
  } catch (error) {
    console.error("Error fetching user's business:", error.message);
    res.status(500).json({ message: "Server error" });
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