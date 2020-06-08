const { Schema, model } = require('mongoose');

const UserModel = new Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  confirmedEmail: {
    type: Boolean,
    default: false,
  },
  emailToken: {
    type: String,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  tokens: [String],
  wishlist: [String],
  cart: {
    cartProducts: Array,
    cartNumbers: {
      type: Number,
      default: 0,
    },
  },
  orders: {
    type: Schema.Types.ObjectId,
    ref: 'order',
  },
  deliveryAddress: {
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    buildingNumber: {
      type: String,
      required: true,
    },
  },
  deliveryType: {
    type: String,
    required: true,
    enum: ['currier', 'post', 'delivery servise'],
  },
  contactPhone: {
    type: Number,
    required: true,
  },
});

const Users = model('user', UserModel);
export default Users;
