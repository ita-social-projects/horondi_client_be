const mongoose = require('mongoose');
const CurrencySet = require('./CurrencySet').schema;

const SizeSchema = new mongoose.Schema({
  name: String,
  heightInCm: Number,
  widthInCm: Number,
  depthInCm: Number,
  volumeInLiters: Number,
  weightInKg: Number,
  available: Boolean,
  additionalPrice: [CurrencySet]
});

module.exports = mongoose.model('Size', SizeSchema);
