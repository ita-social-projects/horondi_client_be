const mongoose = require('mongoose');
const ImageSet = require('../common/ImageSet').schema;
const {
  DB_COLLECTIONS_NAMES: { HOME_PAGE_IMAGES },
} = require('../../consts/db-collections-names');

const HomePageImagesSchema = new mongoose.Schema({
  images: ImageSet,
});

module.exports = mongoose.model(HOME_PAGE_IMAGES, HomePageImagesSchema);
