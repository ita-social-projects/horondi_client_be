const mongoose = require('mongoose');
const ImageSet = require('../common/ImageSet').schema;
const Address = require('../common/Address').schema;

const { UserInputError } = require('apollo-server');

const {
  SUPER_ADMIN_IS_IMMUTABLE,
} = require('../../error-messages/user.messages');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  role: {
    type: String,
    enum: ['user', 'admin', 'superadmin'],
    default: 'user',
  },
  email: String,
  phoneNumber: String,
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
  purchasedProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
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
