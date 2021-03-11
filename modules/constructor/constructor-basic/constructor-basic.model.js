const mongoose = require('mongoose');
const Language = require('../../../models/Language').schema;
const CurrencySet = require('../../../models/CurrencySet').schema;
const {
  DB_COLLECTIONS_NAMES: { CONSTRUCTOR_BASICS, MATERIAL, COLOR },
} = require('../../../consts/db-collections-names');

const {
  RANGES: { MIN, MAX },
} = require('../../../consts/ranges');

const constructorBasicSchema = new mongoose.Schema({
  name: [Language],
  material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MATERIAL,
  },
  color: {
    type: mongoose.Schema.Types.ObjectId,
    ref: COLOR,
  },
  image: String,
  basePrice: [CurrencySet],
  available: Boolean,
  default: Boolean,
});

module.exports = mongoose.model(CONSTRUCTOR_BASICS, constructorBasicSchema);
