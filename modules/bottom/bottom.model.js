const mongoose = require('mongoose');
const ImageSet = require('../common/ImageSet').schema;
const Language = require('../../models/Language').schema;
const AdditionalCurrencySet = require('../../models/AdditionalCurrencySet')
  .schema;
const {
  DB_COLLECTIONS_NAMES: { BOTTOM, MATERIAL, COLOR },
} = require('../../consts/db-collections-names');

const bottomSchema = new mongoose.Schema({
  name: [Language],
  optionType: String,
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
});

module.exports = mongoose.model(BOTTOM, bottomSchema);
