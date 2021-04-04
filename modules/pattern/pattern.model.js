const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const ImageSet = require('../common/ImageSet').schema;
const CurrencySet = require('../../models/CurrencySet').schema;
const {
  DB_COLLECTIONS_NAMES: { PATTERN, MATERIAL, MODEL },
} = require('../../consts/db-collections-names');

const patternSchema = new mongoose.Schema({
  name: [Language],
  description: [Language],
  optionType: String,
  model: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MODEL,
  },
  features: {
    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MATERIAL,
    },
    handmade: Boolean,
  },
  images: ImageSet,
  constructorImg: String,
  additionalPrice: [CurrencySet],
  available: Boolean,
  default: Boolean,
});

module.exports = mongoose.model(PATTERN, patternSchema);
