const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const ImageSet = require('../common/ImageSet').schema;

const {
  DB_COLLECTIONS_NAMES: { HOME_PAGE_SLIDE, TRANSLATIONS },
} = require('../../consts/db-collections-names');

const HomePageSlideSchema = new mongoose.Schema({
  title: [Language],
  description: [Language],
  link: {
    type: String,
  },
  images: ImageSet,
  order: Number,
  show: Boolean,
  translations_key: {
    type: mongoose.Schema.Types.ObjectId,
    ref: TRANSLATIONS,
  },
});

module.exports = mongoose.model(HOME_PAGE_SLIDE, HomePageSlideSchema);
