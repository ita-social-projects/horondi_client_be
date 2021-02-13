const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const ImageSet = require('../common/ImageSet').schema;
const { INPUT_NOT_VALID } = require('../../error-messages/common.messages');

const CategorySchema = new mongoose.Schema({
  code: {
    type: String,
    minlength: [2, 'INPUT_NOT_VALID'],
    maxlength: [30, 'INPUT_NOT_VALID'],
  },
  name: [Language],
  images: ImageSet,
  available: Boolean,
});

module.exports = mongoose.model('Category', CategorySchema);
