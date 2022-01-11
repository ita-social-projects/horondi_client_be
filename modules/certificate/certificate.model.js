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
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: USER,
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  dateStart: {
    type: Date,
    default: Date.now(),
  },
  dateEnd: {
    type: Date,
    default: Date.now() + 366 * 24 * 60 * 60 * 1000,
  },
});

module.exports = mongoose.model(CERTIFICATE, certificateSchema);
