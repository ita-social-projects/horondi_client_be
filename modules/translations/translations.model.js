const mongoose = require('mongoose');

const {
  DB_COLLECTIONS_NAMES: { TRANSLATIONS },
} = require('../../consts/db-collections-names');

const translationsSchema = new mongoose.Schema({
  ua: {},
  en: {},
});

module.exports = mongoose.model(TRANSLATIONS, translationsSchema);
