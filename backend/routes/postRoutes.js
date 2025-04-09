const express = require('express');
const router = express.Router();
const Post = require("../models/Post");
const authMiddleware = require("../middleware/auth");
const multer = require('multer');
const { uploadImageToFirebase } = require('../utils/firebase');

// ✅ Setup multer for multiple images
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Create a post with multiple images
router.post("/", authMiddleware, upload.array('images', 5), async (req, res) => {
  try {
    const { text, businessName } = req.body;
    let imageUrls = [];

    // ✅ Upload multiple images to Firebase
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file =>
        uploadImageToFirebase(file.buffer, file.originalname, file.mimetype)
      );
      imageUrls = await Promise.all(uploadPromises);
    }

    const newPost = new Post({
      user: req.user._id,
      businessName,
      text,
      imageUrl: imageUrls, // ✅ Now stores an array of image URLs
    });

    await newPost.save();
    res.status(201).json({ message: "Post created successfully", newPost });
  } catch (error) {
    console.error("❌ Error creating post:", error);
    res.status(500).json({ message: error.message });
  }
});

// ✅ Get all posts (with user populated)
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

// ✅ Add comment to a post
router.post("/:postId/comments", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;

    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

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
