const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const CurrencySet = require('../../models/CurrencySet').schema;
const {
  DB_COLLECTIONS_NAMES: { MATERIAL, COLOR },
} = require('../../consts/db-collections-names');
const {
  materialPurposes: { MAIN, INNER, BOTTOM, PATTERN, CLOSURE },
} = require('../../consts/material-purposes');

const materialSchema = new mongoose.Schema({
  name: [Language],
  description: [Language],
  purpose: {
    type: String,
    enum: [MAIN, INNER, BOTTOM, PATTERN, CLOSURE],
    required: true,
  },
  colors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLOR,
    },
  ],
  available: Boolean,
  additionalPrice: [CurrencySet],
});

module.exports = mongoose.model(MATERIAL, materialSchema);
