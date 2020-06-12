const mongoose = require('mongoose');

const CurrencySchema = new mongoose.Schema({
    date: {
      type: Date,
      default: Date.now
    },
    convertOptions: [
      {
        name: String,
        exchangeRate: Number,
        show: Boolean
      }
    ],
});

module.exports = mongoose.model('Currency', CurrencySchema);
