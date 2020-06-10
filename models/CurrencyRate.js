const mongoose = require('mongoose');

const CurrencyRateSchema = new mongoose.Schema({
  code: String,
  coeficient: Number,
});

module.exports = mongoose.model('CurrencyRate', CurrencyRateSchema);
