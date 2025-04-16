const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// ✅ Register a New User
router.post("/register", async (req, res) => {
    try {
        const { name, email, businessName, password } = req.body;

        // 🔹 Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // 🔹 Hash password before saving
        const salt = await bcrypt.genSalt(15);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log("Hashed password:", hashedPassword);
        // 🔹 Create new user
        const newUser = new User({
            name,
            email,
            businessName,
            password: hashedPassword, // Save hashed password
            role: "user",
        });

        await newUser.save();

        const token = jwt.sign({ _id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, {
            expiresIn: "1h",
          });

        res.status(201).json({ message: "User registered successfully!", newUser });
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
            // 🔹 Search by name or email (case insensitive)
            users = await User.find({
                $or: [
                    { name: { $regex: search, $options: "i" } }, 
                    { email: { $regex: search, $options: "i" } }
                ]
            }).select("-password"); // Exclude passwords
        } else {
            // 🔹 Return all users
            users = await User.find().select("-password"); // Exclude passwords
        }

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ Get a Specific User by ID
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password"); // Exclude password

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ Update User Details
router.put("/:id", authMiddleware(["user", "owner", "admin"]), async (req, res) => {
    try {
        const { firstName, lastName, bio, location, website, logo } = req.body;

        // Checks if req.body is empty
        if (!Object.keys(req.body).length) {
            return res.status(400).json({ message: "No fields updated" });
        }

        // Filter out undefined fields
        const updates = {};
        Object.keys(req.body).forEach((key) => {
            if (req.body[key] !== undefined) {
                updates[key] = req.body[key];
            }
        }
        );

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User updated successfully", updatedUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ Delete User
router.delete("/:id", authMiddleware(["owner", "admin"]), async (req, res) => {
    try {
        const userToDelete= await User.findById(req.params.id);

        if (!userToDelete) {
            return res.status(404).json({ message: "User not found" });
        }

         // Check if the authenticated user is the owner of the account or an admin
    if (req.user._id !== userToDelete._id.toString() && req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. You can only delete your own account or must be an admin." });
      }
  
      // Prevent deleting an admin account unless the requester is also an admin
      if (userToDelete.role === "admin" && req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Only admins can delete other admin accounts." });
      }
  
      await userToDelete.remove();

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/assign-role/:id", authMiddleware(["admin"]), async (req, res) => {
    try {
      const { role } = req.body;
  
      // Validate the role
      if (!["user", "owner", "admin"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
  
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      user.role = role;
      await user.save();
  
      res.status(200).json({ message: "Role assigned successfully", user });
    } catch (error) {
      console.error("❌ Role Assignment Error:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  });

module.exports = router;
