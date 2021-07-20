const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const AdditionalCurrencySet = require('../../models/AdditionalCurrencySet').schema;
const {
  DB_COLLECTIONS_NAMES: { MATERIAL, COLOR },
} = require('../../consts/db-collections-names');
const {
  materialPurposes: { MAIN, INNER, BOTTOM, PATTERN, CLOSURE, BACK },
} = require('../../consts/material-purposes');

const materialSchema = new mongoose.Schema({
  name: [Language],
  description: [Language],
  purpose: {
    type: String,
    enum: [MAIN, INNER, BOTTOM, PATTERN, CLOSURE, BACK],
    required: true,
  },
  colors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLOR,
    },
  ],
  available: Boolean,
  additionalPrice: [AdditionalCurrencySet],
});

module.exports = mongoose.model(MATERIAL, materialSchema);
