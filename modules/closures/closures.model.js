const mongoose = require('mongoose');
const ImageSet = require('../common/ImageSet').schema;
const Language = require('../../models/Language').schema;
const CurrencySet = require('../../models/CurrencySet').schema;
const {
  DB_COLLECTIONS_NAMES: { CLOSURE, MATERIAL, COLOR, MODEL },
} = require('../../consts/db-collections-names');

const closureSchema = new mongoose.Schema({
  name: [Language],
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
    color: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLOR,
    },
  },
  images: ImageSet,
  additionalPrice: [CurrencySet],
  available: Boolean,
  customizable: Boolean,
});

module.exports = mongoose.model(CLOSURE, closureSchema);
