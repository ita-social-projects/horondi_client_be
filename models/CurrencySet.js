const mongoose = require('mongoose');

const {
  DB_TABLES_NAMES: { CURRENCY_SET },
} = require('../consts/db-tables-names');

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
