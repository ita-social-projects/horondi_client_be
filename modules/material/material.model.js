const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const CurrencySet = require('../../models/CurrencySet').schema;
const FIELD_ERROR_MESSAGE = require('../../error-messages/common.messages');

const materialSchema = new mongoose.Schema({
  name: [Language],
  description: [Language],
  purpose: {
    type: String,
    enum: ['MAIN', 'INNER', 'BOTTOM', 'PATTERN', 'CLOSURE'],
    required: [true, FIELD_ERROR_MESSAGE],
  },
  colors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Color',
    },
  ],
  available: Boolean,
  additionalPrice: [CurrencySet],
});

module.exports = mongoose.model('Material', materialSchema);
