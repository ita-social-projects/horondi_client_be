const mongoose = require('mongoose');
const ImageSet = require('../common/ImageSet').schema;
const Address = require('../common/Address').schema;

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
  },
  email: String,
  phoneNumber: Number,
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
});

module.exports = mongoose.model('User', userSchema);
