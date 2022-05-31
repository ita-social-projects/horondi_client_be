const mongoose = require('mongoose');
const ImageSet = require('../common/ImageSet').schema;
const Language = require('../../models/Language').schema;
const {
  DB_COLLECTIONS_NAMES: { BASICS, MATERIAL, COLOR, TRANSLATIONS },
} = require('../../consts/db-collections-names');

const basicsSchema = new mongoose.Schema({
  name: [Language],
  images: ImageSet,
  available: Boolean,
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
  absolutePrice: Number,
  translationsKey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: TRANSLATIONS,
  },
});

module.exports = mongoose.model(BASICS, basicsSchema);
