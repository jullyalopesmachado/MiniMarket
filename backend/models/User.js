const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // ✅ Changed bcrypt to bcryptjs for Windows compatibility

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  businessName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}, 
{ collection: 'Login' });

// ✅ Index for faster searches
userSchema.index({ name: 1, email: 1 });

// ✅ Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ✅ Compare passwords for login
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
