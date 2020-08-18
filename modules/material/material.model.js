const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const Color = require('../../models/Color').schema;

const materialSchema = new mongoose.Schema({
  name: [Language],
  description: [Language],
  purpose: String,
  colors: [Color],
  available: Boolean,
  additionalPrice: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Material', materialSchema);
