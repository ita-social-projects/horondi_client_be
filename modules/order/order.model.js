const mongoose = require('mongoose');
const CurrencySet = require('../../models/CurrencySet').schema;
const Delivery = require('../../models/Delivery').schema;
const OrderItem = require('../../models/OrderItem').schema;

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
    firstName: String,
    lastName: String,
    patronymicName: String,
    email: String,
    phoneNumber: Number,
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
