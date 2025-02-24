const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  businessName: {type: String, required: true },
  createdAt: { type: Date, default: Date.now },
},
  {collection: 'Login'});

userSchema.index({ name: 1, email: 1 });

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


module.exports = mongoose.model('User', userSchema );
