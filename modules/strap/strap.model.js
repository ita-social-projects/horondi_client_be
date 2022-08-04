const mongoose = require('mongoose');

const ImageSet = require('../common/ImageSet').schema;
const Language = require('../../models/Language').schema;
const {
  DB_COLLECTIONS_NAMES: { COLOR, MATERIAL, STRAP, TRANSLATIONS },
} = require('../../consts/db-collections-names');

const strapSchema = new mongoose.Schema({
  name: [Language],
  optionType: String,
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
  available: Boolean,
  translationsKey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: TRANSLATIONS,
  },
});

module.exports = mongoose.model(STRAP, strapSchema);
