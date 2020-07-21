const mongoose = require('mongoose');

const CurrencySchema = new mongoose.Schema({
  lastUpdatedDate: Date,
  convertOptions: [
    {
      name: String,
      exchangeRate: Number,
    },
  ],
});

module.exports = mongoose.model('Currency', CurrencySchema);
