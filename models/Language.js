const mongoose = require('mongoose');
const { INPUT_NOT_VALID } = require('../error-messages/common.messages');

const languageSchema = new mongoose.Schema({
  lang: {
    type: String,
    validate: {
      validator: function(v) {
        return /^[а-яїієґ0-9\s]+$/i.test(v) || /^[a-z0-9\s]+$/i.test(v);
      },
      message: INPUT_NOT_VALID,
    },
  },
  value: String,
  _id: false,
  id: false,
});

module.exports = mongoose.model('Language', languageSchema);
