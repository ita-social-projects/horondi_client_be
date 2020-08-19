const mongoose = require('mongoose');

const EmailChatSchema = new mongoose.Schema({
  text: String,
  senderName: String,
  date: {
    type: Date,
    default: Date.now,
  },
  email: String,
  status: {
    type: String,
    required: true,
    default: 'pending',
    enum: ['pending', 'answered', 'spam'],
  },
  answer: {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    date: Date,
    text: String,
  },
});

module.exports = mongoose.model('EmailChat', EmailChatSchema);
