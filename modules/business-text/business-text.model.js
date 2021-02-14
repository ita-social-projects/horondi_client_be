const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const {
  CODE_IS_TO_SHORT,
  CODE_IS_TO_LONG,
} = require('../../error-messages/business-text.messages');

const businessTextSchema = new mongoose.Schema({
  code: {
    type: String,
    minlength: [2, CODE_IS_TO_SHORT],
    maxlength: [20, CODE_IS_TO_LONG],
  },
  title: [Language],
  text: [Language],
  languages: [String],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('BusinessText', businessTextSchema);
