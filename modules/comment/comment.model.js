const mongoose = require('mongoose');
const FIELD_ERROR_MESSAGE = require('../../error-messages/common.messages');

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, FIELD_ERROR_MESSAGE],
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
