const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;

const headersSchema = new mongoose.Schema({
  title: [Language],
  link: String,
  priority: Number,
});

module.exports = mongoose.model('Header', headersSchema);
