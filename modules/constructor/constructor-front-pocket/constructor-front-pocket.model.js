const mongoose = require('mongoose');

const Language = require('../../../models/Language').schema;
const CurrencySet = require('../../../models/CurrencySet').schema;
const {
  DB_COLLECTIONS_NAMES: {
    CONSTRUCTOR_FRONT_POCKET,
    MATERIAL,
    COLOR,
    MODEL,
    PATTERN,
  },
} = require('../../../consts/db-collections-names');

const constructorFrontPocketSchema = new mongoose.Schema({
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
    pattern: {
      type: mongoose.Schema.Types.ObjectId,
      ref: PATTERN,
    },
  },
  image: String,
  basePrice: [CurrencySet],
  available: Boolean,
  customizable: Boolean,
});

module.exports = mongoose.model(
  CONSTRUCTOR_FRONT_POCKET,
  constructorFrontPocketSchema,
);
