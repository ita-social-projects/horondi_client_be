const mongoose = require('mongoose');

const Language = require('../../models/Language').schema;
const AdditionalCurrencySet =
  require('../../models/AdditionalCurrencySet').schema;
const {
  DB_COLLECTIONS_NAMES: { POCKET, POSITION, TRANSLATIONS },
} = require('../../consts/db-collections-names');
const ImageSet = require('../common/ImageSet').schema;

const pocketSchema = new mongoose.Schema({
  name: [Language],
  images: ImageSet,
  additionalPrice: [AdditionalCurrencySet],
  restriction: Boolean,
  positions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: POSITION,
    },
  ],
  optionType: String,
  translationsKey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: TRANSLATIONS,
  },
});

module.exports = mongoose.model(POCKET, pocketSchema);
