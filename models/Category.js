const mongoose = require('mongoose');

const Language = require('./Language').schema;

const CategorySchema = new mongoose.Schema({
  categoryCode: String,
  name: [Language],
  image: String,
});

module.exports = mongoose.model('Category', CategorySchema);
