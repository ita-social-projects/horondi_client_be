const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const ImageSet = require('../common/ImageSet').schema;
const {
  CODE_IS_TOO_SHORT,
  CODE_IS_TOO_LONG,
} = require('../../error-messages/category.messages');

const CategorySchema = new mongoose.Schema({
  code: {
    type: String,
    minlength: [2, CODE_IS_TOO_SHORT],
    maxlength: [30, CODE_IS_TOO_LONG],
  },
  name: [Language],
  images: ImageSet,
  available: Boolean,
});

module.exports = mongoose.model('Category', CategorySchema);
