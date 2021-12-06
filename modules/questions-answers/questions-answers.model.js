const mongoose = require('mongoose');

const {
  DB_COLLECTIONS_NAMES: { TRANSLATIONS },
} = require('../../consts/db-collections-names');

const {
  DB_COLLECTIONS_NAMES: { QNA },
} = require('../../consts/db-collections-names');

const questionsAnswersSchema = new mongoose.Schema({
  question: String,
  answer: String,
  translationsKey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: TRANSLATIONS,
  },
});

module.exports = mongoose.model(QNA, questionsAnswersSchema);
