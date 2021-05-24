const mongoose = require('mongoose');

const Language = require('../../models/Language').schema;
const CurrencySet = require('../../models/CurrencySet').schema;
const {
  DB_COLLECTIONS_NAMES: { MODEL, COLOR, STRAP },
} = require('../../consts/db-collections-names');

const strapSchema = new mongoose.Schema({
  name: [Language],
  optionType: String,
  model: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MODEL,
  },
  features: {
    color: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLOR,
    },
  },
  image: String,
  additionalPrice: [CurrencySet],
  available: Boolean,
  customizable: Boolean,
});

module.exports = mongoose.model(STRAP, strapSchema);
