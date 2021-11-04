const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const {
  DB_COLLECTIONS_NAMES: { HEADER, TRANSLATIONS },
} = require('../../consts/db-collections-names');

const headersSchema = new mongoose.Schema({
  title: [Language],
  link: String,
  priority: Number,
  translations_key: {
    type: mongoose.Schema.Types.ObjectId,
    ref: TRANSLATIONS,
  },
});

module.exports = mongoose.model(HEADER, headersSchema);
