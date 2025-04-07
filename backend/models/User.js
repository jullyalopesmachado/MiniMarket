const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  businessName: { type: String, required: true },
  emailVerified: { type: Boolean, default: false }, // ✅ Track verification status
  emailToken: { type: String }, // ✅ Store verification token
  createdAt: { type: Date, default: Date.now },
}, { collection: 'Login' });

userSchema.index({ name: 1, email: 1 });

module.exports = mongoose.model('User', userSchema);
