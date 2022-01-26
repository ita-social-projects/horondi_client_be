const mongoose = require('mongoose');

const {
  DB_COLLECTIONS_NAMES: { CERTIFICATE, USER },
} = require('../../consts/db-collections-names');

const dateStart = new Date();
const dateEnd = new Date();
dateEnd.setDate(dateEnd.getDate() + 1);
dateEnd.setFullYear(dateEnd.getFullYear() + 1);

const certificateSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  value: {
    type: Number,
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
    default: dateStart,
  },
  dateEnd: {
    type: Date,
    default: dateEnd,
  },
});

module.exports.CertificateModel = mongoose.model(
  CERTIFICATE,
  certificateSchema
);
