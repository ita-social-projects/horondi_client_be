const mongoose = require('mongoose');

const EmailChatSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  email: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: 'pending',
    enum: ['pending', 'answered'],
  },
});

module.exports = mongoose.model('EmailChat', EmailChatSchema);
