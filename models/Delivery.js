const mongoose = require('mongoose');
const CurrencySet = require('./CurrencySet').schema;

const deliverySchema = new mongoose.Schema({
  sentOn: Date,
  sentBy: {
    type: String,
    enum: ['NOVA-POST', 'UKR-POST', 'SELF-PICKUP'],
    default: 'SELF-PICKUP',
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
