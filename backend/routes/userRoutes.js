const express = require("express");
const router = express.Router();
const multer = require("multer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");
const { uploadImageToFirebase, deleteImageFromFirebase } = require("../utils/firebase");

// Multer config for in-memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Auth middleware to verify JWT
const verifyToken = authMiddleware(["user", "owner", "admin"]);

// 🚀 New Register Route
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, businessName } = req.body;

    if (!name || !email || !password || !businessName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      businessName,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("❌ Registration Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Update User (includes optional profile picture and image replacement)
router.put("/:id", verifyToken, upload.single("profilePicture"), async (req, res) => {
  try {
    const allowedFields = ["name", "bio", "location", "website"];
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.file) {
      // 🔥 Delete old profile image if exists
      if (user.profileImage) {
        await deleteImageFromFirebase(user.profileImage);
      }

      // ✅ Upload new image to Firebase
      const imageUrl = await uploadImageToFirebase(req.file.buffer, req.file.originalname, req.file.mimetype);
      updates.profileImage = imageUrl;
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select("-password");
    res.json({ message: "User updated successfully", updatedUser });
  } catch (err) {
    console.error("❌ Update error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get Profile Info (used on frontend)
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
