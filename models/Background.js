const mongoose = require('mongoose');

const ImageSet = require('../modules/common/ImageSet').schema;
const {
  DB_TABLES_NAMES: { BACKGROUND },
} = require('../consts/db-tables-names');

const BackgroundSchema = new mongoose.Schema({
  usedIn: String,
  images: ImageSet,
  active: Boolean,
});

module.exports = mongoose.model(BACKGROUND, BackgroundSchema);
