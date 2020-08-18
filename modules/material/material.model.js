const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const CurrencySet = require('../../models/CurrencySet').schema;
const Color = require('../../models/Color').schema;

const materialSchema = new mongoose.Schema({
  name: [Language],
  description: [Language],
  purpose: String,
  colors: [Color],
  available: Boolean,
  additionalPrice: [CurrencySet]
});

module.exports = mongoose.model('Material', materialSchema);
