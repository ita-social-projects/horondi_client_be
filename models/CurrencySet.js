const mongoose = require('mongoose');

const currencySetSchema = new mongoose.Schema({
  currency: String,
  value: {
    type: Number,
    default: 0,
  }
});

module.exports = mongoose.model('CurrencySet', currencySetSchema);
