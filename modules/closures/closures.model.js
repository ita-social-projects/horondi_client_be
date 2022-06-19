const mongoose = require('mongoose');
const ImageSet = require('../common/ImageSet').schema;
const Language = require('../../models/Language').schema;
const {
  DB_COLLECTIONS_NAMES: { CLOSURE, MATERIAL, COLOR, MODEL, TRANSLATIONS },
} = require('../../consts/db-collections-names');

const closureSchema = new mongoose.Schema({
  name: [Language],
  optionType: String,
  model: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MODEL,
  },
  features: {
    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MATERIAL,
    },
    color: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLOR,
    },
  },
  images: ImageSet,
  absolutePrice: { type: Number, default: null },
  relativePrice: { type: Number, default: null },
  translations_key: {
    type: mongoose.Schema.Types.ObjectId,
    ref: TRANSLATIONS,
  },
  available: Boolean,
  customizable: Boolean,
});

module.exports = mongoose.model(CLOSURE, closureSchema);
