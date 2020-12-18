const mongoose = require('mongoose');

const languageSchema = new mongoose.Schema({
  lang: String,
  value: String,
  _id: false,
  id: false,
});

module.exports = mongoose.model('Language', languageSchema);
