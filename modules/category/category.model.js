const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const ImageSet = require('../common/ImageSet').schema;
const {
  CATEGORY_VALIDATION_ERROR,
  CATEGORY_ERROR_MESSAGE,
} = require('../../error-messages/category.messages');

const CategorySchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, CATEGORY_ERROR_MESSAGE],
    min: [2, CATEGORY_VALIDATION_ERROR],
    max: [30, CATEGORY_VALIDATION_ERROR],
  },
  name: [Language],
  images: ImageSet,
  available: Boolean,
});

module.exports = mongoose.model('Category', CategorySchema);
