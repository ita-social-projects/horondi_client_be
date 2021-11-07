const mongoose = require('mongoose');

const Language = require('../../models/Language').schema;
const ImageSet = require('../common/ImageSet').schema;
const {
  DB_COLLECTIONS_NAMES: { CATEGORY, TRANSLATIONS },
} = require('../../consts/db-collections-names');

const CategorySchema = new mongoose.Schema({
  code: {
    type: String,
  },
  name: [Language],
  images: ImageSet,
  available: Boolean,
  translationsKey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: TRANSLATIONS,
  },
});

module.exports = mongoose.model(CATEGORY, CategorySchema);
