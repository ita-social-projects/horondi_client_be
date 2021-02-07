const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const {
  COLOR_VALIDATION_ERROR,
} = require('../../error-messages/color.massage');

const ColorSchema = new mongoose.Schema({
  name: [Language],
  colorHex: {
    type: String,
    required: [true, COLOR_VALIDATION_ERROR],
  },
  simpleName: [Language],
});

module.exports = mongoose.model('Color', ColorSchema);
