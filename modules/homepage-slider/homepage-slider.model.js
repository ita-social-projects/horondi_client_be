const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const ImageSet = require('../common/ImageSet').schema;
const { INPUT_NOT_VALID } = require('../../error-messages/common.messages');

const HomePageSlideSchema = new mongoose.Schema({
  title: [Language],
  description: [Language],
  link: {
    type: String,
    minlength: [1, 'INPUT_NOT_VALID'],
    maxlength: [30, 'INPUT_NOT_VALID'],
  },
  images: ImageSet,
  order: Number,
  show: Boolean,
});

module.exports = mongoose.model('HomePageSlide', HomePageSlideSchema);
