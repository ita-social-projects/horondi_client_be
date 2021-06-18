const mongoose = require('mongoose');

const AdditionalCurrencySet = require('../../models/AdditionalCurrencySet').schema;
const Language = require('../../models/Language').schema;
const {
  DB_COLLECTIONS_NAMES: { SIZE, MODEL },
} = require('../../consts/db-collections-names');

const sizeSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  simpleName: [Language],
  model: {
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
  additionalPrice: [AdditionalCurrencySet],
});

module.exports = mongoose.model(SIZE, sizeSchema);
