const mongoose = require('mongoose');

const ImageSet = require('../common/ImageSet').schema;
const Language = require('../../models/Language').schema;
const {
  DB_COLLECTIONS_NAMES: {
    CONSTRUCTOR,
    BASICS,
    MODEL,
    BOTTOM,
    PATTERN,
    BACK,
    STRAP,
    CLOSURE,
    POCKET,
  },
} = require('../../consts/db-collections-names');

const constructorSchema = new mongoose.Schema({
  name: [Language],
  model: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MODEL,
  },
  images: ImageSet,
  basics: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: BASICS,
    },
  ],
  bottoms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: BOTTOM,
    },
  ],
  patterns: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: PATTERN,
    },
  ],
  backs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: BACK,
    },
  ],
  straps: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: STRAP,
    },
  ],
  closures: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: CLOSURE,
    },
  ],
  pockets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: POCKET,
    },
  ],
});

module.exports = mongoose.model(CONSTRUCTOR, constructorSchema);
