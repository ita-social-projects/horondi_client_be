const mongoose = require('mongoose');

const Language = require('../../models/Language').schema;
// const ImageSet = require('../common/ImageSet').schema;
const {
  DB_COLLECTIONS_NAMES: { POSITION },
} = require('../../consts/db-collections-names');

const PositionSchema = new mongoose.Schema({
  name: [Language],
  available: Boolean,
});

module.exports = mongoose.model(POSITION, PositionSchema);
