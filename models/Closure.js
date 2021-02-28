const mongoose = require('mongoose');

const Language = require('./Language').schema;
const CurrencySet = require('./CurrencySet').schema;
const Color = require('./Color').schema;
const {
  DB_COLLECTIONS_NAMES: { CLOSURE },
} = require('../consts/db-collections-names');

const closureSchema = new mongoose.Schema({
  name: [Language],
  colors: [Color],
  available: Boolean,
  additionalPrice: [CurrencySet],
});

module.exports = mongoose.model(CLOSURE, closureSchema);
