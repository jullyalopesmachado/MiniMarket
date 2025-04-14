const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  expirationDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  businessName: { type: String, required: true } // optional but useful for quick display  
}, { collection: 'Deals' });

module.exports = mongoose.model('Deal', dealSchema);
