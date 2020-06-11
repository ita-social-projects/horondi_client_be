const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  role: {
    type: String,
    enum: ['user', 'admin'], // enum: [user, admin]
  },
  email: String,
  phoneNumber: String, // nomber
  address: {
    country: String,
    city: String,
    street: String,
    buildingNumber: String,
    appartment: String,
  },
  avatar: String,
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
      wished: String,
    },
  ],
  carts: [
    {
      cart: String,
    },
  ],
  orders: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Order',
    },
  ],
});

module.exports = mongoose.model('User', userSchema);
