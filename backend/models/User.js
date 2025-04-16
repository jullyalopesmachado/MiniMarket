const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true, select: false },
  businessName: {type: String, required: true },
  bio: { type: String },
  location: { type: String },
  website: { type: String },
  profileImage: { type: String },
  role: { type: String, enum: ['admin', 'owner', 'user'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
},
  {collection: 'Login'});

userSchema.index({ name: 1, email: 1, password: 1, BusinessName:1 });


module.exports = mongoose.model('User', userSchema );
