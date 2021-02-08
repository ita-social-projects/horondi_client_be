const mongoose = require('mongoose');
const {
  EMAIL_ERROR,
  USER_NOT_FOUND,
  WRONG_CREDENTIALS,
  EMAIL_VALIDATION_ERROR,
} = require('../../error-messages/user.messages');
const {
  FIELD_ERROR_MESSAGE,
  INPUT_VALIDATION_ERROR,
} = require('../../error-messages/common.messages');

const EmailChatSchema = new mongoose.Schema({
  text: {
    type: String,
    minlength: [2, INPUT_VALIDATION_ERROR],
    maxlength: [700, INPUT_VALIDATION_ERROR],
    required: [true, FIELD_ERROR_MESSAGE],
  },
  senderName: {
    type: String,
    required: [true, USER_NOT_FOUND],
  },
  language: {
    type: Number,
    enum: [0, 1],
    default: 0,
    required: [true, INPUT_VALIDATION_ERROR],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: EMAIL_VALIDATION_ERROR,
    },
    required: [true, EMAIL_ERROR],
  },
  status: {
    type: String,
    required: [true, WRONG_CREDENTIALS],
    default: 'PENDING',
    enum: ['PENDING', 'ANSWERED', 'SPAM'],
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
