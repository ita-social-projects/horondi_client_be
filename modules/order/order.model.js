const mongoose = require('mongoose');
const CurrencySet = require('../../models/CurrencySet').schema;
const Delivery = require('../../models/Delivery').schema;
const OrderItem = require('../../models/OrderItem').schema;
const {
  FIRST_NAME_TOO_SHORT,
  FIRST_NAME_TOO_LONG,
  FIRST_NAME_IS_REQUIRED,
  LAST_NAME_TOO_SHORT,
  LAST_NAME_TOO_LONG,
  LAST_NAME_IS_REQUIRED,
  PHONE_NUMBER_NOT_VALID,
  PHONE_NUMBER_IS_REQUIRED,
  EMAIL_NOT_VALID,
  EMAIL_IS_REQUIRED,
} = require('../../error-messages/common.messages');

const orderSchema = new mongoose.Schema({
  orderNumber: String,
  status: {
    type: String,
    required: true,
    enum: [
      'CREATED',
      'CONFIRMED',
      'PRODUCED',
      'CANCELLED',
      'REFUNDED',
      'SENT',
      'DELIVERED',
    ],
    default: 'CREATED',
  },
  user: {
    firstName: {
      type: String,
      minlength: [2, FIRST_NAME_TOO_SHORT],
      maxlength: [20, FIRST_NAME_TOO_LONG],
      required: [true, FIRST_NAME_IS_REQUIRED],
    },
    lastName: {
      type: String,
      minlength: [2, LAST_NAME_TOO_SHORT],
      maxlength: [20, LAST_NAME_TOO_LONG],
      required: [true, LAST_NAME_IS_REQUIRED],
    },
    email: {
      type: String,
      validate: {
        validator: function(v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: EMAIL_NOT_VALID,
      },
      required: [true, EMAIL_IS_REQUIRED],
    },
    phoneNumber: {
      type: String,
      validate: {
        validator: function(v) {
          return /^\+?3?8?(0\d{9})$/.test(v);
        },
        message: PHONE_NUMBER_NOT_VALID,
      },
      required: [true, PHONE_NUMBER_IS_REQUIRED],
    },
  },
  dateOfCreation: {
    type: Date,
    default: Date.now,
  },
  lastUpdatedDate: {
    type: Date,
    default: Date.now,
  },
  userComment: {
    type: String,
    default: '',
  },
  cancellationReason: {
    type: String,
    default: '',
  },
  delivery: Delivery,
  items: [OrderItem],
  totalItemsPrice: [CurrencySet],
  totalPriceToPay: [CurrencySet],
  paymentMethod: {
    type: String,
    enum: ['CARD', 'CASH'],
    default: 'CASH',
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paymentStatus: {
    type: String,
    enum: [
      'CREATED',
      'EXPIRED',
      'APPROVED',
      'DECLINED',
      'REVERSED',
      'PROCESSING',
    ],
  },
});

module.exports = mongoose.model('Order', orderSchema);
