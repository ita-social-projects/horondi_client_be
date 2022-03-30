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
    POSITION,
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
  pocketsWithRestrictions: [
    {
      currentPocketWithPosition: {
        pocket: {
          type: mongoose.Schema.Types.ObjectId,
          ref: POCKET,
        },
        position: {
          type: mongoose.Schema.Types.ObjectId,
          ref: POSITION,
        },
      },
      otherPocketsWithAvailablePositions: [
        {
          pocket: {
            type: mongoose.Schema.Types.ObjectId,
            ref: POCKET,
          },
          position: {
            type: mongoose.Schema.Types.ObjectId,
            ref: POSITION,
          },
        },
      ],
    },
  ],
});

module.exports = mongoose.model(CONSTRUCTOR, constructorSchema);
