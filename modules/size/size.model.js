const mongoose = require('mongoose');
const CurrencySet = require('../../models/CurrencySet').schema;

const sizeSchema = new mongoose.Schema({
  name: String,
  heightInCm: Number,
  widthInCm: Number,
  depthInCm: Number,
  volumeInLiters: Number,
  weightInKg: Number,
  available: Boolean,
  additionalPrice: [CurrencySet],
});

module.exports = mongoose.model('Size', sizeSchema);
