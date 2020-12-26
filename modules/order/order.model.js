const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const CurrencySet = require('../../models/CurrencySet').schema;
const Address = require('../common/Address').schema;

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
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: Number,
  },
  dateOfCreation: {
    required: true,
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
  adminComment: {
    type: String,
    default: '',
  },
  cancellationReason: {
    type: String,
    default: '',
  },
  delivery: {
    sentOn: Date,
    sentBy: {
      type: String,
      required: true,
      enum: ['NOVAPOST', 'UKRPOST', 'SELFPICKUP'],
      default: 'SELF-PICKUP',
    },
    byCourier: Boolean,
    courierOffice: Number,
    invoiceNumber: String,
    cost: {
      type: [CurrencySet],
      required: true,
    },
  },
  address: Address,
  items: [
    {
      productId: {
        type: String,
        required: true,
      },
      sizeId: {
        type: String,
      },
      additions: [[Language]],
      actualPrice: [CurrencySet],
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
  totalItemsPrice: [CurrencySet],
  totalPriceToPay: [CurrencySet],
  paymentMethod: {
    type: String,
    required: true,
    enum: ['CARD', 'CASH'],
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
