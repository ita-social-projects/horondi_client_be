const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const ImageSet = require('../common/ImageSet').schema;
const {
  DB_COLLECTIONS_NAMES: { PATTERN, MATERIAL },
} = require('../../consts/db-collections-names');

const patternSchema = new mongoose.Schema({
  name: [Language],
  description: [Language],
  images: ImageSet,
  constructorImg: String,
  material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MATERIAL,
  },
  handmade: Boolean,
  available: Boolean,
});

module.exports = mongoose.model(PATTERN, patternSchema);
