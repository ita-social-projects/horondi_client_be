const mongoose = require('mongoose');

const ImageSet = require('../common/ImageSet').schema;
const Language = require('../../models/Language').schema;
const {
  DB_COLLECTIONS_NAMES: { COLOR, STRAP, TRANSLATIONS },
} = require('../../consts/db-collections-names');

const strapSchema = new mongoose.Schema({
  name: [Language],
  optionType: String,
  features: {
    color: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLOR,
    },
  },
  images: ImageSet,
  absolutePrice: Number,
  available: Boolean,
  translationsKey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: TRANSLATIONS,
  },
});

module.exports = mongoose.model(STRAP, strapSchema);
