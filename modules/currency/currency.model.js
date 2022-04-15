const mongoose = require('mongoose');

const {
  DB_COLLECTIONS_NAMES: { CURRENCY },
} = require('../../consts/db-collections-names');

const CurrencySchema = new mongoose.Schema({
  lastUpdatedDate: Date,
  convertOptions: {
    UAH: {
      name: String,
      exchangeRate: Number,
      unicode: String,
    },
    USD: {
      name: String,
      exchangeRate: Number,
      unicode: String,
    },
  },
});

module.exports = mongoose.model(CURRENCY, CurrencySchema);
