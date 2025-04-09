const express = require("express");
const Business = require("../models/Business");
const User = require("../models/User"); // Import User model
const router = express.Router();
const authMiddleware = require("../middleware/auth");

// Add a new business (Protected Route)
router.post('/add', authMiddleware, async (req, res) => {
  try {

    
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
    });

    console.log("New Business:", newBusiness); // Debugging log

    await newBusiness.save();
    res.status(201).json({ message: "Business added successfully", newBusiness });
  } catch (err) {
    if (err.name === "ValidationError") {
        return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "An unexpected error occurred." });
}
});

// ✅ Get All Users or Search Users
router.get("/", async (req, res) => {
    try {
        const { search } = req.query;
        let businesses;

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
    }
});

router.get("/:id", async (req, res) => {
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
  }
});

module.exports = router;
