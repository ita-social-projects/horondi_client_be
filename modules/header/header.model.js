const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const {
  DB_COLLECTIONS_NAMES: { HEADER },
} = require('../../consts/db-collections-names');

const headersSchema = new mongoose.Schema({
  title: [Language],
  link: String,
  priority: Number,
});

module.exports = mongoose.model(HEADER, headersSchema);
