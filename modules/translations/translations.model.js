const mongoose = require('mongoose');

const {
  DB_COLLECTIONS_NAMES: { TRANSLATIONS },
} = require('../../consts/db-collections-names');

const translationsSchema = new mongoose.Schema({
  ua: {
    name: String,
    title: String,
    description: String,
  },
  en: {
    name: String,
    title: String,
    description: String,
  },
});

module.exports = mongoose.model(TRANSLATIONS, translationsSchema);
