const mongoose = require("mongoose");

const BusinessSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the user
    required: true,
    ref: "User", // Reference the 'users' collection
  },
 industry: { type: String, required: true,},
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
