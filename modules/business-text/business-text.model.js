const mongoose = require('mongoose');

const Language = require('../../models/Language').schema;
const {
  CODE_IS_TOO_SHORT,
  CODE_IS_TOO_LONG,
} = require('../../error-messages/business-text.messages');
const {
  DB_TABLES_NAMES: { BUSINESS_TEXT },
} = require('../../consts/db-tables-names');

const businessTextSchema = new mongoose.Schema({
  code: {
    type: String,
    minlength: [2, CODE_IS_TOO_SHORT],
    maxlength: [20, CODE_IS_TOO_LONG],
  },
  title: [Language],
  text: [Language],
  languages: [String],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(BUSINESS_TEXT, businessTextSchema);
