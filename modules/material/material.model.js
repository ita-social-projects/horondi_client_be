const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const CurrencySet = require('../../models/CurrencySet').schema;

const materialSchema = new mongoose.Schema({
  name: [Language],
  description: [Language],
  purpose: {
    type: String,
    enum: ['MAIN', 'INNER', 'BOTTOM'],
    required: true,
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
