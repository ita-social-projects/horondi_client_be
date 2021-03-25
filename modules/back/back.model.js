const mongoose = require('mongoose');

const Language = require('../../models/Language').schema;
const CurrencySet = require('../../models/CurrencySet').schema;
const {
  DB_COLLECTIONS_NAMES: { MODEL, BACK, MATERIAL, COLOR },
} = require('../../consts/db-collections-names');

const backSchema = new mongoose.Schema({
  name: [Language],
  model: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MODEL,
  },
  material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MATERIAL,
  },
  color: {
    type: mongoose.Schema.Types.ObjectId,
    ref: COLOR,
  },
  image: String,
  additionalPrice: [CurrencySet],
  available: Boolean,
  default: Boolean,
});

module.exports = mongoose.model(BACK, backSchema);
