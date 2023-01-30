const mongoose = require('mongoose');

const ImageSet = require('../common/ImageSet').schema;
const Language = require('../../models/Language').schema;
const {
  DB_COLLECTIONS_NAMES: { COLOR, MATERIAL, STRAP, TRANSLATIONS },
} = require('../../consts/db-collections-names');

const strapSchema = new mongoose.Schema({
  name: [Language],
  features: {
    color: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLOR,
    },
    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MATERIAL,
    },
  },
  images: ImageSet,
  relativePrice: { type: Number, default: null },
  absolutePrice: { type: Number, default: null },
  available: Boolean,
  translationsKey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: TRANSLATIONS,
  },
  optionType: String,
});

module.exports = mongoose.model(STRAP, strapSchema);
