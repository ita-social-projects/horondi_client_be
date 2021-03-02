const mongoose = require('mongoose');

const {
  DB_COLLECTIONS_NAMES: { CURRENCY_SET },
} = require('../consts/db-collections-names');

const currencySetSchema = new mongoose.Schema({
  currency: String,
  value: {
    type: Number,
    default: 0,
  },
  _id: false,
  id: false,
});

module.exports = mongoose.model(CURRENCY_SET, currencySetSchema);
