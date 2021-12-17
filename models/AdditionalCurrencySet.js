const mongoose = require('mongoose');

const {
  DB_COLLECTIONS_NAMES: { ADDITIONAL_CURRENCY_SET },
} = require('../consts/db-collections-names');
const {
  ADDITIONAL_PRICE_TYPES: { ABSOLUTE_INDICATOR, RELATIVE_INDICATOR },
} = require('../consts/additional-price-types');

const additionalCurrencySetSchema = new mongoose.Schema({
  currency: String,
  value: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    enum: [ABSOLUTE_INDICATOR, RELATIVE_INDICATOR],
    default: ABSOLUTE_INDICATOR,
  },
  _id: false,
  id: false,
});

module.exports = mongoose.model(
  ADDITIONAL_CURRENCY_SET,
  additionalCurrencySetSchema,
);
