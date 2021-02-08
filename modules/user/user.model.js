const mongoose = require('mongoose');
const ImageSet = require('../common/ImageSet').schema;
const Address = require('../common/Address').schema;
const {
  WRONG_CREDENTIALS,
  INPUT_NOT_VALID,
  EMAIL_ERROR,
  EMAIL_VALIDATION_ERROR,
} = require('../../error-messages/user.messages');
const PHONE_NUMBER_NOT_VALID = require('../../error-messages/common.messages');

const { UserInputError } = require('apollo-server');

const {
  SUPER_ADMIN_IS_IMMUTABLE,
} = require('../../error-messages/user.messages');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    minlength: [2, WRONG_CREDENTIALS],
    maxlength: [20, WRONG_CREDENTIALS],
    required: [true, INPUT_NOT_VALID],
  },
  lastName: {
    type: String,
    minlength: [2, WRONG_CREDENTIALS],
    maxlength: [20, WRONG_CREDENTIALS],
    required: [true, INPUT_NOT_VALID],
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'superadmin'],
    default: 'user',
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: EMAIL_VALIDATION_ERROR,
    },
    required: [true, EMAIL_ERROR],
  },
  phoneNumber: {
    type: String,
    minlength: [12, WRONG_CREDENTIALS],
    maxlength: [12, WRONG_CREDENTIALS],
    required: [true, PHONE_NUMBER_NOT_VALID],
  },
  address: Address,
  images: ImageSet,
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
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
  banned: {
    type: Boolean,
    default: false,
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  recoveryAttempts: Number,
  lastRecoveryDate: {
    type: Date,
    default: Date.now,
  },
  recoveryToken: String,
  confirmationToken: String,
});

userSchema.pre('findOneAndDelete', async function(next) {
  const query = this.getQuery();
  const user = await this.model.findOne(query);

  if (user.role === 'superadmin') {
    throw new UserInputError(SUPER_ADMIN_IS_IMMUTABLE, { statusCode: 403 });
  }

  next();
});

module.exports = mongoose.model('User', userSchema);
