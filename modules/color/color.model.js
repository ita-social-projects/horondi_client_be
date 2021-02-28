const mongoose = require('mongoose');

const Language = require('../../models/Language').schema;
const {
  COLOR_HEX_TOO_SHORT,
  COLOR_HEX_TOO_LONG,
  COLOR_HEX_NOT_FOUND,
} = require('../../error-messages/color.massage');
const {
  DB_TABLES_NAMES: { COLOR },
} = require('../../consts/db-tables-names');

const ColorSchema = new mongoose.Schema({
  name: [Language],
  colorHex: {
    type: String,
    minlength: [2, COLOR_HEX_TOO_SHORT],
    maxlength: [10, COLOR_HEX_TOO_LONG],
    required: [true, COLOR_HEX_NOT_FOUND],
  },
  simpleName: [Language],
});

module.exports = mongoose.model(COLOR, ColorSchema);
