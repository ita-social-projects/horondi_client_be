const mongoose = require('mongoose');
const { INPUT_VALIDATION_ERROR } = require('../error-messages/common.messages');

const languageSchema = new mongoose.Schema({
  lang: {
    type: String,
    required: [true, INPUT_VALIDATION_ERROR],
  },
  value: {
    type: String,
    required: [true, INPUT_VALIDATION_ERROR],
  },
  _id: false,
  id: false,
});

module.exports = mongoose.model('Language', languageSchema);
