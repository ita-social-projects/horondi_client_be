const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const {
  COLOR_HEX_NOT_VALID,
  COLOR_HEX_NOT_FOUND,
} = require('../../error-messages/color.massage');

const ColorSchema = new mongoose.Schema({
  name: [Language],
  colorHex: {
    type: String,
    minlength: [2, 'COLOR_HEX_NOT_VALID'],
    maxlength: [10, 'COLOR_HEX_NOT_VALID'],
    required: [true, 'COLOR_HEX_NOT_FOUND'],
  },
  simpleName: [Language],
});

module.exports = mongoose.model('Color', ColorSchema);
