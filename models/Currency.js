const mongoose = require('mongoose');
const CurrencyRate = require('./CurrencyRate').schema;

const CurrencySchema = new mongoose.Schema({
    date: {
      type: Date,
      default: Date.now
    },
    convertOptions: [CurrencyRate],
});

module.exports = mongoose.model('Currency', CurrencySchema);
