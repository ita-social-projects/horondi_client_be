const mongoose = require('mongoose');

const Language = require('../../models/Language').schema;
const CurrencySet = require('../../models/CurrencySet').schema;
const {
  DB_COLLECTIONS_NAMES: { CLOSURE, MATERIAL },
} = require('../../consts/db-collections-names');

const closureSchema = new mongoose.Schema({
  name: [Language],
  material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MATERIAL,
  },
  image: String,
  additionalPrice: [CurrencySet],
  available: Boolean,
});

module.exports = mongoose.model(CLOSURE, closureSchema);
