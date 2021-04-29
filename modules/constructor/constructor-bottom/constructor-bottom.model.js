const mongoose = require('mongoose');

const Language = require('../../../models/Language').schema;
const CurrencySet = require('../../../models/CurrencySet').schema;
const {
  DB_COLLECTIONS_NAMES: { CONSTRUCTOR_BOTTOM, MATERIAL, COLOR, MODEL },
} = require('../../../consts/db-collections-names');

const constructorBottomSchema = new mongoose.Schema({
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
  image: String,
  basePrice: [CurrencySet],
  available: Boolean,
  customizable: Boolean,
});
module.exports = mongoose.model(CONSTRUCTOR_BOTTOM, constructorBottomSchema);
