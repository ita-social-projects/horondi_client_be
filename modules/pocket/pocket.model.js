const mongoose = require('mongoose');

const Language = require('../../models/Language').schema;
const CurrencySet = require('../../models/CurrencySet').schema;
const {
  DB_COLLECTIONS_NAMES: { POCKET, POSITION },
} = require('../../consts/db-collections-names');
const ImageSet = require('../common/ImageSet').schema;

const pocketSchema = new mongoose.Schema({
  name: [Language],
  images: ImageSet,
  additionalPrice: [CurrencySet],
  restriction: Boolean,
  positions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: POSITION,
    },
  ],
  optionType: String,
});

module.exports = mongoose.model(POCKET, pocketSchema);
