const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Business = require("../models/Business");
const authMiddleware = require("../middleware/auth");
const sendEmail = require("../utils/emailService"); // <-- Email sender
const router = express.Router();

// ✅ Register a New User (with Email Verification)
router.post("/", async (req, res) => {
    try {
        const { name, email, businessName, password } = req.body;

        // 🔹 Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // 🔹 Generate email verification token
        const emailToken = crypto.randomBytes(32).toString("hex");

        // 🔹 Create user (unverified)
        const newUser = new User({
            name,
            email,
            businessName,
            password,
            emailVerified: false,
            emailToken,
        });

        await newUser.save();

        // 🔹 Send verification email
        const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${emailToken}`;
        await sendEmail(email, "Verify Your Email", `
            <h3>Welcome to MiniMarket!</h3>
            <p>Click the link below to verify your email address:</p>
            <a href="${verifyLink}">${verifyLink}</a>
        `);

        res.status(201).json({ message: "Verification email sent. Please check your inbox." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ Email Verification Endpoint
router.get("/verify-email", async (req, res) => {
    try {
        const { token } = req.query;
        const user = await User.findOne({ emailToken: token });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        user.emailVerified = true;
        user.emailToken = undefined;
        await user.save();

        res.json({ message: "Email verified successfully. You can now log in." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ Get All Users or Search Users
router.get("/", async (req, res) => {
    try {
        const { search } = req.query;
        let users;

        if (search) {
            users = await User.find({
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } }
                ]
            }).select("-password");
        } else {
            users = await User.find().select("-password");
        }

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ Get a Specific User by ID
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ Update User Profile (Authenticated)
router.put("/profile", authMiddleware, async (req, res) => {
    try {
        const { name, email, businessName, password } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (name) user.name = name;
        if (email) user.email = email;
        if (businessName) user.businessName = businessName;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        res.json({ message: "Profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ Delete User Account (Authenticated)
router.delete("/profile", authMiddleware, async (req, res) => {
    try {
        const userId = req.user._id;

        await Business.deleteMany({ user: userId });
        await User.findByIdAndDelete(userId);

        res.json({ message: "Account and businesses deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
