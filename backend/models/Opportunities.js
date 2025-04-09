const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  location: { type: String, required: true },
  posted_by: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
},
  {collection: 'Opportunities'});



module.exports = mongoose.model('Opportunity', opportunitySchema );
