const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const {
  LANGUAGES: { UK, EN },
} = require('../../consts/languages');
const {
  BRAND_NAMES: { UK_NAME, EN_NAME },
} = require('../../consts/brand-names');
const {
  DB_COLLECTIONS_NAMES: { NEWS, TRANSLATIONS },
} = require('../../consts/db-collections-names');

const NewsSchema = new mongoose.Schema({
  title: [Language],
  slug: String,
  text: [Language],
  image: String,
  author: {
    name: {
      type: Array,
      default: [
        {
          lang: UK,
          value: UK_NAME,
        },
        {
          lang: EN,
          value: EN_NAME,
        },
      ],
    },
    image: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  show: Boolean,
  languages: [String],
  translationsKey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: TRANSLATIONS,
  },
});

module.exports = mongoose.model(NEWS, NewsSchema);
