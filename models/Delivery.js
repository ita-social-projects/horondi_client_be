const mongoose = require('mongoose');
const CurrencySet = require('./CurrencySet').schema;

const deliverySchema = new mongoose.Schema({
  _id: false,
  sentOn: Date,
  sentBy: {
    type: String,
    enum: [
      'NOVAPOST',
      'UKRPOST',
      'SELFPICKUP',
      'NOVAPOSTCOURIER',
      'UKRPOSTCOURIER',
    ],
    default: 'SELFPICKUP',
  },
  byCourier: Boolean,
  courierOffice: Number,
  invoiceNumber: String,
  cost: {
    type: [CurrencySet],
    required: true,
  },
});

module.exports = mongoose.model('Delivery', deliverySchema);
