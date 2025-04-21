const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming you have a User model

const authMiddleware = (requiredRoles = []) => {
  return async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    if (!verified) {
      return res.status(401).json({ message: "Token verification failed, access denied." });
    }

    req.user = verified; // 🔹 Attach decoded user info to req.user

    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
      return res.status(403).json({ message: "Access denied. You do not have the required role." });
    }


    console.log("✅ Authenticated User:", req.user); // Debugging log
    next();
  } catch (error) {
    console.error("❌ Token verification error:", error);
    res.status(400).json({ message: 'Invalid token' });
  }
};
};
module.exports = authMiddleware;
