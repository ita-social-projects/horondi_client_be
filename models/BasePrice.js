const mongoose = require('mongoose');

const basePriceSchema = new mongoose.Schema({
  currency: String,
  value: Number,
});

module.exports = mongoose.model('BasePrice', basePriceSchema);
