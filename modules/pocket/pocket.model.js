const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const CurrencySet = require('../../models/CurrencySet').schema;
const Blocker = require('../blocker/blocker.model').schema;
const {
  DB_COLLECTIONS_NAMES: { PRODUCT, POCKET },
} = require('../../consts/db-collections-names');

const pocketSchema = new mongoose.Schema({
  name: [Language],
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: PRODUCT,
  },
  blockers: [Blocker],
  image: String,
  basePrice: [CurrencySet],
  available: Boolean,
  default: Boolean,
});

module.exports = mongoose.model(POCKET, pocketSchema);
