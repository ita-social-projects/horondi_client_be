const mongoose = require('mongoose');

const {
  DB_COLLECTIONS_NAMES: { TRANSLATIONS },
} = require('../../consts/db-collections-names');

const Language = require('../../models/Language').schema;

const {
  DB_COLLECTIONS_NAMES: { QNA },
} = require('../../consts/db-collections-names');

const questionsAnswersSchema = new mongoose.Schema({
  question: [Language],
  answer: [Language],
  translationsKey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: TRANSLATIONS,
  },
});

module.exports = mongoose.model(QNA, questionsAnswersSchema);
