const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const ImageSet = require('../common/ImageSet').schema;
const FIELD_ERROR_MESSAGE = require('../../error-messages/common.messages');

const HomePageSlideSchema = new mongoose.Schema({
  title: [Language],
  description: [Language],
  link: {
    type: String,
    required: [true, FIELD_ERROR_MESSAGE],
  },
  images: ImageSet,
  order: Number,
  show: Boolean,
});

module.exports = mongoose.model('HomePageSlide', HomePageSlideSchema);
