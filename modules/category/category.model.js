const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const ImageSet = require('../common/ImageSet').schema;

const CategorySchema = new mongoose.Schema({
  code: String,
  name: [Language],
  images: ImageSet,
  available: Boolean,
});

module.exports = mongoose.model('Category', CategorySchema);
