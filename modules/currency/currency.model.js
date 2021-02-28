const mongoose = require('mongoose');

const {
  DB_TABLES_NAMES: { CURRENCY },
} = require('../../consts/db-tables-names');

const CurrencySchema = new mongoose.Schema({
  lastUpdatedDate: Date,
  convertOptions: [
    {
      name: String,
      exchangeRate: Number,
    },
  ],
});

module.exports = mongoose.model(CURRENCY, CurrencySchema);
