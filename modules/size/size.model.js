const mongoose = require('mongoose');

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
  absolutePrice: { type: Number, default: null },
  relativePrice: { type: Number, default: null },
});

module.exports = mongoose.model(SIZE, sizeSchema);
