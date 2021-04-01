const mongoose = require('mongoose');

const {
  DB_COLLECTIONS_NAMES: { SIDE },
} = require('../consts/db-collections-names');
const {
  SIDES: { RIGHT, LEFT, FRONT, BACK },
} = require('../consts/side-names');

const sideSchema = new mongoose.Schema({
  side: {
    type: String,
    enum: [RIGHT, LEFT, FRONT, BACK],
    required: true,
  },
});

module.exports = mongoose.model(SIDE, sideSchema);
