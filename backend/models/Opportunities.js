const mongoose = require('mongoose');
const opportunitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  posted_by: { type: String, required: true }, // optional, display name
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  businessName: { type: String, required: true },
  is_paid: { type: Boolean, default: false },
  amount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'Opportunities' });

module.exports = mongoose.model('Opportunity', opportunitySchema);
