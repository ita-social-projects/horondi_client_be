const mongoose = require('mongoose');
const ImageSet = require('../common/ImageSet').schema;
const Address = require('../common/Address').schema;
const {
  PHONE_NUMBER_NOT_VALID,
} = require('../../error-messages/common.messages');

const {
  DB_COLLECTIONS_NAMES: { USER: USER_DB, COMMENT, ORDER },
} = require('../../consts/db-collections-names');
const {
  roles: { USER, ADMIN, SUPERADMIN },
} = require('../../consts/index');
const {
  USER_BLOCK_PERIOD: { UNLOCKED },
  USER_BLOCK_COUNT: { NO_ONE_TIME },
} = require('../../consts/user-block-period');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  role: {
    type: String,
    enum: [USER, ADMIN, SUPERADMIN],
    default: USER,
  },
  email: {
    type: String,
    lowercase: true,
  },
  phoneNumber: {
    type: String,
    validate: {
      validator(v) {
        return /^[+]*[(]?\d{1,4}[)]?[-\s/0-9]{9}$/.test(v);
      },
      message: PHONE_NUMBER_NOT_VALID,
    },
  },
  address: Address,
  images: ImageSet,
  configs: {
    currency: {
      type: Number,
      default: 0,
    },
    language: {
      type: String,
      default: 'ua',
    },
    theme: {
      type: String,
      default: 'light',
    },
  },
  credentials: [
    {
      source: String, // local, google, facebook
      tokenPass: String,
    },
  ],
  registrationDate: {
    type: Date,
    default: Date.now,
  },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: ORDER,
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: COMMENT,
    },
  ],
  banned: {
    blockPeriod: {
      type: String,
      default: UNLOCKED,
    },
    blockCount: {
      type: Number,
      default: NO_ONE_TIME,
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  otp_code: String,
  recoveryAttempts: Number,
  lastRecoveryDate: {
    type: Date,
    default: Date.now,
  },
  recoveryToken: String,
  confirmationToken: String,
});

module.exports = mongoose.model(USER_DB, userSchema);
