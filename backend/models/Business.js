const mongoose = require("mongoose");

const BusinessSchema = new mongoose.Schema({
  owner: {
    type: String, // Reference to the user
    required: true,
    ref: "User", // Reference the 'users' collection
  },
  
  name: { type: String, required: true, },
  description: { type: String, required: true, },
 industry: { type: String, },
  address: { street: { type: String},
             city: { type: String},
             state: {type: String},
             country: {type: String},
  },
  contact: { 
    phone: { type: String, required: true, },
    email: { type: String, required: true, },
             },
  website: { type: String},
  createdAt: { type: Date, default: Date.now },
}, {collection: 'Business'});

module.exports = mongoose.model('Business', BusinessSchema);
