const express = require('express');
const router = express.Router();
const User = require("../models/User"); // ✅ Needed to fetch business name
const authMiddleware = require("../middleware/auth");
const multer = require('multer');
const { uploadImageToFirebase } = require('../utils/firebase');
const Post = require("../models/Post"); // ✅ Import the Post model

// ✅ Setup multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Create a post (deal or normal) with optional images
router.post("/new", authMiddleware(["owner", "admin"]), upload.array('images', 5), async (req, res) => {
  try {
    const { text, expirationDate } = req.body;
    let imageUrls = [];

    // ✅ Upload images to Firebase if present
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file =>
        uploadImageToFirebase(file.buffer, file.originalname, file.mimetype)
      );
      imageUrls = await Promise.all(uploadPromises);
    }

    // ✅ Fetch businessName automatically
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newPost = new Post({
      user: req.user._id,
      businessName: user.businessName,
      text,
      expirationDate: expirationDate || null,
      imageUrl: imageUrls,
    });

    await newPost.save();
    res.status(201).json({ message: "Post created successfully", newPost });
  } catch (error) {
    console.error("❌ Error creating post:", error);
    res.status(500).json({ message: error.message });
  }
});

// ✅ Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email");
    res.json(posts);
  } catch (error) {
    console.error("❌ Error fetching posts:", error);
    res.status(500).json({ message: error.message });
  }
});

// ✅ Get only active "deal" posts
router.get("/deals", async (req, res) => {
  try {
    const today = new Date();
    const deals = await Post.find({
      expirationDate: { $exists: true, $gte: today }
    }).sort({ expirationDate: 1 });

    res.json(deals);
  } catch (error) {
    console.error("❌ Error fetching deals:", error);
    res.status(500).json({ message: error.message });
  }
});

// ✅ Add comment to a post
router.post("/:postId/comments", authMiddleware(["owner", "admin"]), async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = {
      user: req.user._id,
      text,
    };

    post.comments.push(comment);
    await post.save();

    res.json({ message: "Comment added", post });
  } catch (error) {
    console.error("❌ Error adding comment:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;