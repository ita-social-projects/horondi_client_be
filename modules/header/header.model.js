const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const HEADER_ERROR_MESSAGE = require('../../error-messages/header.messages');

const headersSchema = new mongoose.Schema({
  title: [Language],
  link: {
    type: String,
    required: [true, HEADER_ERROR_MESSAGE],
  },
  priority: Number,
});

module.exports = mongoose.model('Header', headersSchema);
