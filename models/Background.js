const mongoose = require('mongoose');

const ImageSet = require('../modules/common/ImageSet').schema;
const {
  DB_COLLECTIONS_NAMES: { BACKGROUND },
} = require('../consts/db-collections-names');

const BackgroundSchema = new mongoose.Schema({
  usedIn: String,
  images: ImageSet,
  active: Boolean,
});

module.exports = mongoose.model(BACKGROUND, BackgroundSchema);
