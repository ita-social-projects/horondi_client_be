const mongoose = require('mongoose');

const Language = require('../../models/Language').schema;
const AdditionalCurrencySet = require('../../models/AdditionalCurrencySet')
  .schema;
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
  additionalPrice: [AdditionalCurrencySet],
  available: Boolean,
  customizable: Boolean,
});

module.exports = mongoose.model(STRAP, strapSchema);
