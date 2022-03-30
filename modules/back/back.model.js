const mongoose = require('mongoose');
const ImageSet = require('../common/ImageSet').schema;
const Language = require('../../models/Language').schema;
const AdditionalCurrencySet =
  require('../../models/AdditionalCurrencySet').schema;
const {
  DB_COLLECTIONS_NAMES: { MODEL, BACK, MATERIAL, COLOR, TRANSLATIONS },
} = require('../../consts/db-collections-names');

const backSchema = new mongoose.Schema({
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
  additionalPrice: [AdditionalCurrencySet],
  available: Boolean,
  customizable: Boolean,
  translationsKey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: TRANSLATIONS,
  },
});

module.exports = mongoose.model(BACK, backSchema);
