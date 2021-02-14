const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const { INPUT_NOT_VALID } = require('../../error-messages/common.messages');

const businessTextSchema = new mongoose.Schema({
  code: {
    type: String,
    minlength: [2, INPUT_NOT_VALID],
    maxlength: [20, INPUT_NOT_VALID],
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
