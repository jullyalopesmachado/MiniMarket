const mongoose = require("mongoose");

const BusinessSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  email: { type: String, required: true },
  website: { type: String },
  createdAt: { type: Date, default: Date.now },
}, { collection: 'Business' });

module.exports = mongoose.model('Business', BusinessSchema);
