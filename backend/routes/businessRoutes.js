const express = require("express");
const Business = require("../models/Business");
const User = require("../models/User"); // Import User model
const router = express.Router();
const authMiddleware = require("../middleware/auth");

// Add a new business (Protected Route)
router.post('/add', authMiddleware, async (req, res) => {
  try {
<<<<<<< HEAD

    
    const { name, description, industry, address, contact, website } = req.body;
    const owner = req.user._id; // Get the owner ID from the token
    console.log("Owner ID:", owner); // Debugging log
    // 🔹 Get user ID from decoded token

   if (!owner) {
      return res.status(404).json({ message: "User not found" });
    } 

    

    if (!name || !description) {
      return res.status(400).json({ message: "Name and description are required" });
    }

    if (!industry || !contact || !contact.phone || !contact.email) {
      return res.status(400).json({ message: "Industry and contact information are required" });
    }

    

    // Create a new business record
    const newBusiness = new Business({
      owner: owner || "",
      name: name || "",
      description: description || "",
      industry: industry || "", 
      address: {
        street: address?.street || "",
        city: address?.city || "",
        state: address?.state || "",
        country: address?.country || "",
      },
      contact,
      website,
=======
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
>>>>>>> 94e26e5398b5cb181f3367076c0c63e22a55aa2c
    });

    console.log("New Business:", newBusiness); // Debugging log

    await newBusiness.save();
    console.log("✅ Business saved:", newBusiness);
    res.status(201).json({ message: "Business created successfully", newBusiness });

  } catch (err) {
<<<<<<< HEAD
    if (err.name === "ValidationError") {
        return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "An unexpected error occurred." });
}
=======
    console.error("❌ Error creating business:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
>>>>>>> 94e26e5398b5cb181f3367076c0c63e22a55aa2c
});

// ✅ Get All Users or Search Users
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    let businesses;

<<<<<<< HEAD
        if (search) { 
          
            // 🔹 Search by name, owner, industry, or location (case insensitive)
            businesses = await Business.find({
              $or: [
                  { name: { $regex: search, $options: "i" } },
                  { industry: { $regex: search, $options: "i" } },
                  { "address.city": { $regex: search, $options: "i" } },
                  { "address.state": { $regex: search, $options: "i" } },
                  { "address.country": { $regex: search, $options: "i" } },
              ],
          });

            
        } else {
            // 🔹 Return all users
            businesses = await Business.find();
            
        }

        res.json(businesses);
    } catch (error) {
        res.status(500).json({ message: error.message });
=======
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
>>>>>>> 94e26e5398b5cb181f3367076c0c63e22a55aa2c
    }

    res.json(businesses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
<<<<<<< HEAD
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid business ID" });
  }

  try {
      const business = await Business.findById(req.params.id);

      if (!business) {
          return res.status(404).json({ message: "Business not found" });
      }

      res.json(business);
  } catch (error) {
      res.status(500).json({ message: error.message });
=======
  try {
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(business);
  } catch (error) {
    res.status(500).json({ message: error.message });
>>>>>>> 94e26e5398b5cb181f3367076c0c63e22a55aa2c
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