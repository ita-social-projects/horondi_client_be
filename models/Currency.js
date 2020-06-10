const mongoose = require('mongoose');
const CurrencyRate = require('./CurrencyRate').schema;

const CurrencySchema = new mongoose.Schema({
  date: Date,
  convertOptions: [CurrencyRate],
});

module.exports = mongoose.model('Currency', CurrencySchema);
