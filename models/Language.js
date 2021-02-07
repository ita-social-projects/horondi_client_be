const mongoose = require('mongoose');
const {
  INPUT_VALIDATION_ERROR,
  FIELD_ERROR_MESSAGE,
} = require('../error-messages/common.messages');

const languageSchema = new mongoose.Schema({
  lang: {
    type: String,
    required: [true, INPUT_VALIDATION_ERROR],
  },
  value: {
    type: String,
    required: [true, INPUT_VALIDATION_ERROR],
    min: [2, FIELD_ERROR_MESSAGE],
    max: [30, FIELD_ERROR_MESSAGE],
  },
  _id: false,
  id: false,
});

module.exports = mongoose.model('Language', languageSchema);
