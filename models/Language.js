const mongoose = require('mongoose');

const { INPUT_NOT_VALID } = require('../error-messages/common.messages');
const {
  DB_COLLECTIONS_NAMES: { LANGUAGE },
} = require('../consts/db-collections-names');

const languageSchema = new mongoose.Schema({
  lang: {
    type: String,
    validate: {
      validator(v) {
        return /^[а-яїієґ0-9\s]+$/i.test(v) || /^[a-z0-9\s]+$/i.test(v);
      },
      message: INPUT_NOT_VALID,
    },
  },
  value: mongoose.Mixed,
  _id: false,
  id: false,
});

module.exports = mongoose.model(LANGUAGE, languageSchema);
