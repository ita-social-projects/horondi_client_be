const mongoose = require('mongoose');

const {
  DB_COLLECTIONS_NAMES: { TRANSLATIONS },
} = require('../../consts/db-collections-names');

const {
  CODE_IS_TOO_SHORT,
  CODE_IS_TOO_LONG,
} = require('../../error-messages/business-text.messages');
const {
  DB_COLLECTIONS_NAMES: { BUSINESS_TEXT },
} = require('../../consts/db-collections-names');

const BusinessTextImg = new mongoose.Schema({
  _id: false,
  id: String,
  name: String,
  src: String,
});

const businessTextSchema = new mongoose.Schema({
  code: {
    type: String,
    minlength: [2, CODE_IS_TOO_SHORT],
    maxlength: [20, CODE_IS_TOO_LONG],
  },
  sectionsImgs: [BusinessTextImg],
  footerImg: BusinessTextImg,
  languages: [String],
  date: {
    type: Date,
    default: Date.now,
  },
  translationsKey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: TRANSLATIONS,
  },
});

module.exports = mongoose.model(BUSINESS_TEXT, businessTextSchema);
