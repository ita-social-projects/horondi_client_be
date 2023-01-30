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
    unique: true,
  },
  value: {
    type: Number,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: USER,
    default: null,
  },
  ownedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: USER,
    default: null,
  },
  email: {
    type: String,
    default: null,
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
  dateOfUsing: {
    type: Date,
    default: null,
  },
  isExpired: {
    type: Boolean,
    default: false,
  },
  inProgress: {
    type: Boolean,
    default: false,
  },
  isActivated: {
    type: Boolean,
    default: false,
  },
  dateStart: {
    type: Date,
    default: dateStart,
  },
  dateEnd: {
    type: Date,
    default: dateEnd,
  },
  paymentUrl: {
    type: String,
  },
  paymentStatus: {
    type: String,
  },
  paymentToken: {
    type: String,
  },
});

module.exports.CertificateModel = mongoose.model(
  CERTIFICATE,
  certificateSchema
);
