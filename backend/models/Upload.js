const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const uploadSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  filePath: {
    data: Buffer,
    contentType: String,
  },
  uploadTime: {
    type: Date,
    default: Date.now,
  },
}, {collection: 'Uploads'});


module.exports = mongoose.model('Upload', uploadSchema );
