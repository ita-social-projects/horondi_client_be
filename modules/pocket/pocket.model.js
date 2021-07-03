const mongoose = require('mongoose');

const Language = require('../../models/Language').schema;
const CurrencySet = require('../../models/CurrencySet').schema;
const {
  DB_COLLECTIONS_NAMES: { MODEL, POCKET },
} = require('../../consts/db-collections-names');
const ImageSet = require('../common/ImageSet').schema;
const { RIGHT, LEFT, FRONT, BACK } = require('../../consts/side-names');

const pocketSchema = new mongoose.Schema({
  name: [Language],
  optionType: String,
  images: ImageSet,
  additionalPrice: [CurrencySet],
  restriction: Boolean,
});

module.exports = mongoose.model(POCKET, pocketSchema);
