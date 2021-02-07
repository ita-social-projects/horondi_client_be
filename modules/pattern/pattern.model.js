const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const ImageSet = require('../common/ImageSet').schema;
const IMAGE_NOT_PROVIDED = require('../../error-messages/pattern.messages');
const MATERIAL_NOT_FOUND = require('../../error-messages/material.messages');

const patternSchema = new mongoose.Schema({
  name: [Language],
  description: [Language],
  images: ImageSet,
  constructorImg: {
    type: String,
    required: [true, IMAGE_NOT_PROVIDED],
  },
  material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material',
    required: [true, MATERIAL_NOT_FOUND],
  },
  handmade: Boolean,
  available: Boolean,
});

module.exports = mongoose.model('Pattern', patternSchema);
