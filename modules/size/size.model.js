const mongoose = require('mongoose');
const CurrencySet = require('../../models/CurrencySet').schema;
const { INPUT_NOT_VALID } = require('../../error-messages/common.messages');

const sizeSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [1, INPUT_NOT_VALID],
    maxlength: [2, INPUT_NOT_VALID],
    required: [true, INPUT_NOT_VALID],
  },
  heightInCm: {
    type: Number,
    min: [1, INPUT_NOT_VALID],
    max: [35, INPUT_NOT_VALID],
    required: [true, INPUT_NOT_VALID],
  },
  widthInCm: {
    type: Number,
    min: [1, INPUT_NOT_VALID],
    max: [35, INPUT_NOT_VALID],
    required: [true, INPUT_NOT_VALID],
  },
  depthInCm: {
    type: Number,
    min: [1, INPUT_NOT_VALID],
    max: [35, INPUT_NOT_VALID],
    required: [true, INPUT_NOT_VALID],
  },
  volumeInLiters: {
    type: Number,
    min: [1, INPUT_NOT_VALID],
    max: [35, INPUT_NOT_VALID],
    required: [true, INPUT_NOT_VALID],
  },
  weightInKg: {
    type: Number,
    min: [0.1, INPUT_NOT_VALID],
    max: [5, INPUT_NOT_VALID],
    required: [true, INPUT_NOT_VALID],
  },
  available: Boolean,
  additionalPrice: [CurrencySet],
});

module.exports = mongoose.model('Size', sizeSchema);
