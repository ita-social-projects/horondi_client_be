const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const ImageSet = require('../common/ImageSet').schema;
const {
  DB_COLLECTIONS_NAMES: {
    CATEGORY,
    SIZE,
    CONSTRUCTOR_BASICS,
    PATTERN,
    CONSTRUCTOR_FRONT_POCKET,
    CONSTRUCTOR_BOTTOM,
    MODEL,
    POCKET,
    BACK,
    BOTTOM,
    CLOSURE,
    STRAP,
    RESTRICTION,
    TRANSLATIONS,
  },
} = require('../../consts/db-collections-names');

const modelSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: CATEGORY,
  },
  name: [Language],
  description: [Language],
  images: ImageSet,
  priority: Number,
  show: Boolean,
  sizes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: SIZE,
    },
  ],
  availableForConstructor: Boolean,
  eligibleOptions: {
    constructorBasic: [
      { type: mongoose.Schema.Types.ObjectId, ref: CONSTRUCTOR_BASICS },
    ],
    constructorPattern: [
      { type: mongoose.Schema.Types.ObjectId, ref: PATTERN },
    ],
    constructorFrontPocket: [
      { type: mongoose.Schema.Types.ObjectId, ref: CONSTRUCTOR_FRONT_POCKET },
    ],
    constructorBottom: [
      { type: mongoose.Schema.Types.ObjectId, ref: CONSTRUCTOR_BOTTOM },
    ],
    constructorPocket: [{ type: mongoose.Schema.Types.ObjectId, ref: POCKET }],
    constructorBack: [{ type: mongoose.Schema.Types.ObjectId, ref: BACK }],
    constrBottom: [{ type: mongoose.Schema.Types.ObjectId, ref: BOTTOM }],
    constructorClosure: [
      { type: mongoose.Schema.Types.ObjectId, ref: CLOSURE },
    ],
    constructorStrap: [{ type: mongoose.Schema.Types.ObjectId, ref: STRAP }],
  },
  appliedOptions: {
    constructorBasic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: CONSTRUCTOR_BASICS,
    },
    constructorPattern: { type: mongoose.Schema.Types.ObjectId, ref: PATTERN },
    constructorFrontPocket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: CONSTRUCTOR_FRONT_POCKET,
    },
    constructorBottom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: CONSTRUCTOR_BOTTOM,
    },
    constructorPocket: [{ type: mongoose.Schema.Types.ObjectId, ref: POCKET }],
    constructorBack: { type: mongoose.Schema.Types.ObjectId, ref: BACK },
    constrBottom: { type: mongoose.Schema.Types.ObjectId, ref: BOTTOM },
    constructorClosure: { type: mongoose.Schema.Types.ObjectId, ref: CLOSURE },
    constructorStrap: { type: mongoose.Schema.Types.ObjectId, ref: STRAP },
  },
  restrictions: [{ type: mongoose.Schema.Types.ObjectId, ref: RESTRICTION }],

  translationsKey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: TRANSLATIONS,
  },
});

module.exports = mongoose.model(MODEL, modelSchema);
