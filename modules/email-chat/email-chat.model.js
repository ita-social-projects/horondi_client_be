const mongoose = require('mongoose');

const { EMAIL_NOT_VALID } = require('../../error-messages/common.messages');
const {
  DB_COLLECTIONS_NAMES: { EMAIL_CHAT, USER },
} = require('../../consts/db-collections-names');

const {
  EMAIL_MESSAGES_STATUSES: { PENDING, ANSWERED, SPAM },
} = require('../../consts/email-statuses');

const EmailChatSchema = new mongoose.Schema({
  text: String,
  senderName: String,
  language: Number,
  date: {
    type: Date,
    default: Date.now,
  },
  email: String,
  status: {
    type: String,
    required: true,
    default: PENDING,
    enum: [PENDING, ANSWERED, SPAM],
  },
  answer: {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: USER,
    },
    date: Date,
    text: String,
  },
});

module.exports = mongoose.model(EMAIL_CHAT, EmailChatSchema);
