const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  companyId: { type: String, required: true },
  isRead: { type: Boolean, default: false }
}, {
  collection: 'Messages'
});

messageSchema.index({ senderId: 1, receiverId: 1, message: 1, companyId: 1 });

module.exports = mongoose.model('Message', messageSchema);
