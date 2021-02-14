const mongoose = require('mongoose');
const {
  TEXT_TO_SHORT,
  TEXT_TO_LONG,
} = require('../../error-messages/common.messages');

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    minlength: [2, TEXT_TO_SHORT],
    maxlength: [700, TEXT_TO_LONG],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  show: Boolean,
});

module.exports = mongoose.model('Comment', commentSchema);
