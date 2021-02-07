const mongoose = require('mongoose');
const INPUT_VALIDATION_ERROR = require('../../error-messages/common.messages');

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    min: [2, INPUT_VALIDATION_ERROR],
    max: [700, INPUT_VALIDATION_ERROR],
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
