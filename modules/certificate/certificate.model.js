const mongoose = require('mongoose');

const {
  DB_COLLECTIONS_NAMES: { CERTIFICATE, USER },
} = require('../../consts/db-collections-names');

const certificateSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  value: {
    type: Number,
    min: 0,
  },
  status: {
    type: String,
    default: 'Active',
  },

  /* dateStart: {
    type: Date,
    default: Date.now,
  },
  dateEnd: {
    type: Date,
    default: Date.now + 366 * 24 * 60 * 60 * 1000,
  }, */
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: USER,
  },
});

module.exports = mongoose.model(CERTIFICATE, certificateSchema);
