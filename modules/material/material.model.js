const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const {
  DB_COLLECTIONS_NAMES: { MATERIAL, COLOR, TRANSLATIONS },
} = require('../../consts/db-collections-names');
const {
  materialPurposes: { MAIN, INNER, BOTTOM, PATTERN, STRAP, BACK },
} = require('../../consts/material-purposes');

const materialSchema = new mongoose.Schema({
  name: [Language],
  description: [Language],
  purpose: {
    type: String,
    enum: [MAIN, INNER, BOTTOM, PATTERN, STRAP, BACK],
    required: true,
  },
  colors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLOR,
    },
  ],
  available: Boolean,
  absolutePrice: { type: Number, default: null },
  relativePrice: { type: Number, default: null },
  translationsKey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: TRANSLATIONS,
  },
});

module.exports = mongoose.model(MATERIAL, materialSchema);
