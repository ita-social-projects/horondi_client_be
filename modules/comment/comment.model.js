const mongoose = require('mongoose');

const {
  TEXT_TOO_SHORT,
  TEXT_TOO_LONG,
} = require('../../error-messages/common.messages');
const {
  DB_TABLES_NAMES: { COMMENT },
} = require('../../consts/db-tables-names');
const {
  DB_REFS: { PRODUCT, USER },
} = require('../../consts/db-refs');

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    minlength: [2, TEXT_TOO_SHORT],
    maxlength: [700, TEXT_TOO_LONG],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: USER,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: PRODUCT,
  },
  show: Boolean,
});

module.exports = mongoose.model(COMMENT, commentSchema);
