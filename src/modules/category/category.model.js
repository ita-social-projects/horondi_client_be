const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const ImageSet = require('../common/ImageSet').schema;

const CategorySchema = new mongoose.Schema({
  categoryCode: String,
  name: [Language],
  images: ImageSet,
  subcategories: [
    {
      categoryCode: String,
      name: [Language],
      images: ImageSet,
      available: Boolean,
    },
  ],
  available: Boolean,
});

module.exports = mongoose.model('Category', CategorySchema);
