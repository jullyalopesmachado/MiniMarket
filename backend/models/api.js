const express = require("express");
const router = express.Router();

// ✅ Test API Endpoint for React Frontend
router.get("/message", (req, res) => {
  res.json({ message: "Hello from Backend! 🎉" });
});

module.exports = router;
