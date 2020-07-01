const mongoose = require('mongoose');

const languageSchema = new mongoose.Schema({
  lang: String,
  value: String,
});

module.exports = mongoose.model('Language', languageSchema);
