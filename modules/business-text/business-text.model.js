const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;

const businessTextSchema = new mongoose.Schema({
  code: String,
  title: [Language],
  text: [Language],
  languages: [String],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('BusinessText', businessTextSchema);
