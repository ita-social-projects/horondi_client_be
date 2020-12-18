const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;

const ColorSchema = new mongoose.Schema({
  name: [Language],
  colorHex: String,
  available: Boolean,
  simpleName: [Language],
});

module.exports = mongoose.model('Color', ColorSchema);
