const mongoose = require('mongoose');
const CurrencySet = require('../../models/CurrencySet').schema;
const Delivery = require('../../models/Delivery').schema;
const OrderItem = require('../../models/OrderItem').schema;
const {
  PAYMENT_METHODS,
  ORDER_STATUSES,
  EMPTY_STRING,
} = require('../../consts/order-details');

const { CREATED } = ORDER_STATUSES;
const { CASH } = PAYMENT_METHODS;

const orderSchema = new mongoose.Schema({
  orderNumber: String,
  status: {
    type: String,
    default: CREATED,
  },
  user: {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
    },
    phoneNumber: {
      type: String,
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
    default: EMPTY_STRING,
  },
  cancellationReason: {
    type: String,
    default: EMPTY_STRING,
  },
  delivery: Delivery,
  items: [OrderItem],
  totalItemsPrice: [CurrencySet],
  totalPriceToPay: [CurrencySet],
  paymentMethod: {
    type: String,
    default: CASH,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paymentStatus: {
    type: String,
    default: CREATED,
  },
});

module.exports = mongoose.model('Order', orderSchema);
