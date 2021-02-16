const mongoose = require('mongoose');

const {
  LARGE_IMAGE_TO_SHORT,
  LARGE_IMAGE_TO_LONG,
  MEDIUM_IMAGE_TO_SHORT,
  MEDIUM_IMAGE_TO_LONG,
  SMALL_IMAGE_TO_SHORT,
  SMALL_IMAGE_TO_LONG,
  THUMBNAIL_IMAGE_TO_SHORT,
  THUMBNAIL_IMAGE_TO_LONG,
} = require('../../../error-messages/image.messages');

const imageSetSchema = new mongoose.Schema({
  large: {
    type: String,
    minlength: [2, LARGE_IMAGE_TO_SHORT],
    maxlength: [20, LARGE_IMAGE_TO_LONG],
  },
  medium: {
    type: String,
    minlength: [2, MEDIUM_IMAGE_TO_SHORT],
    maxlength: [20, MEDIUM_IMAGE_TO_LONG],
  },
  small: {
    type: String,
    minlength: [2, SMALL_IMAGE_TO_SHORT],
    maxlength: [20, SMALL_IMAGE_TO_LONG],
  },
  thumbnail: {
    type: String,
    minlength: [2, THUMBNAIL_IMAGE_TO_SHORT],
    maxlength: [20, THUMBNAIL_IMAGE_TO_LONG],
  },
});

module.exports = mongoose.model('ImageSet', imageSetSchema);
