const mongoose = require('mongoose');
const ImageSet = require('./ImageSet').schema;
const Address = require('./Address').schema;

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  gender: String,
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
      ref: 'Item',
    },
  ],
  cart: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
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
      ref: 'Comment'
    }
  ]
});

module.exports = mongoose.model('User', userSchema);
