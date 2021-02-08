const mongoose = require('mongoose');
const CurrencySet = require('../../models/CurrencySet').schema;
const Delivery = require('../../models/Delivery').schema;
const OrderItem = require('../../models/OrderItem').schema;
const {
  INPUT_NOT_VALID,
  WRONG_CREDENTIALS,
  EMAIL_ERROR,
  PAYMENT_ERROR,
  EMAIL_VALIDATION_ERROR,
} = require('../../error-messages/user.messages');
const PHONE_NUMBER_NOT_VALID = require('../../error-messages/common.messages');

const orderSchema = new mongoose.Schema({
  orderNumber: String,
  status: {
    type: String,
    required: [true, INPUT_NOT_VALID],
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
    patronymicName: {
      type: String,
      minlength: [2, WRONG_CREDENTIALS],
      maxlength: [20, WRONG_CREDENTIALS],
      required: [true, INPUT_NOT_VALID],
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
    required: [true, PAYMENT_ERROR],
  },
  isPaid: {
    type: Boolean,
    default: false,
    required: [true, PAYMENT_ERROR],
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
