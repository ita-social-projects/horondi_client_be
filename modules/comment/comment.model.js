const mongoose = require('mongoose');
const { INPUT_NOT_VALID } = require('../../error-messages/common.messages');

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    minlength: [2, INPUT_NOT_VALID],
    maxlength: [700, INPUT_NOT_VALID],
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
