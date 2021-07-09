const mongoose = require('mongoose');

const CurrencySet = require('../../models/CurrencySet').schema;
const Language = require('../../models/Language').schema;
const {
  DB_COLLECTIONS_NAMES: { SIZE, MODEL },
} = require('../../consts/db-collections-names');

const sizeSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  modelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MODEL,
  },
  heightInCm: {
    type: Number,
  },
  widthInCm: {
    type: Number,
  },
  depthInCm: {
    type: Number,
  },
  volumeInLiters: {
    type: Number,
  },
  weightInKg: {
    type: Number,
  },
  available: Boolean,
  additionalPrice: [CurrencySet],
});

module.exports = mongoose.model(SIZE, sizeSchema);
