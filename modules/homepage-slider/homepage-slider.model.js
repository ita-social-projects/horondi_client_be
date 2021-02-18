const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const ImageSet = require('../common/ImageSet').schema;
const {
  LINK_TOO_SHORT,
  LINK_TOO_LONG,
} = require('../../error-messages/common.messages');

const HomePageSlideSchema = new mongoose.Schema({
  title: [Language],
  description: [Language],
  link: {
    type: String,
    minlength: [1, LINK_TOO_SHORT],
    maxlength: [30, LINK_TOO_LONG],
  },
  images: ImageSet,
  order: Number,
  show: Boolean,
});

module.exports = mongoose.model('HomePageSlide', HomePageSlideSchema);
