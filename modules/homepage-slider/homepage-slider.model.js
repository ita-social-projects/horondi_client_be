const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const ImageSet = require('../common/ImageSet').schema;
const {
  LINK_TO_SHORT,
  LINK_TO_LONG,
} = require('../../error-messages/common.messages');

const HomePageSlideSchema = new mongoose.Schema({
  title: [Language],
  description: [Language],
  link: {
    type: String,
    minlength: [1, LINK_TO_SHORT],
    maxlength: [30, LINK_TO_LONG],
  },
  images: ImageSet,
  order: Number,
  show: Boolean,
});

module.exports = mongoose.model('HomePageSlide', HomePageSlideSchema);
