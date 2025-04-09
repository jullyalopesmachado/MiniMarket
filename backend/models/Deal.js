const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  expirationDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  businessName: { type: String, required: true } // Optional: link to the business that created it
}, { collection: 'Deals' });

module.exports = mongoose.model('Deal', dealSchema);
