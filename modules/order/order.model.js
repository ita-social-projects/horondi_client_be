const mongoose = require('mongoose');
const CurrencySet = require('../../models/CurrencySet').schema;
const Delivery = require('../../models/Delivery').schema;
const OrderItem = require('../../models/OrderItem').schema;
const {
  PAYMENT_TYPES: { CASH },
} = require('../../consts/payment-types');
const {
  ORDER_STATUSES: { CREATED },
} = require('../../consts/order-statuses');
const {
  DB_COLLECTIONS_NAMES: { ORDER },
} = require('../../consts/db-collections-names');

const orderSchema = new mongoose.Schema({
  orderNumber: Number,
  paymentUrl: {
    type: String,
    default: '',
  },
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

module.exports = mongoose.model(ORDER, orderSchema);
