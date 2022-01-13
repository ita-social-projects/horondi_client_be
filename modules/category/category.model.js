const mongoose = require('mongoose');

const Language = require('../../models/Language').schema;
const ImageSet = require('../common/ImageSet').schema;
const {
  DB_COLLECTIONS_NAMES: { CATEGORY },
} = require('../../consts/db-collections-names');

const CategorySchema = new mongoose.Schema({
  code: {
    type: String,
  },
  name: [Language],
  images: ImageSet,
  available: Boolean,
});

module.exports = mongoose.model(CATEGORY, CategorySchema);
