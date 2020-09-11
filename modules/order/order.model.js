const mongoose = require('mongoose');
const Language = require('../../models/Language').schema;
const CurrencySet = require('../../models/CurrencySet').schema;
const Address = require('../common/Address').schema;

const orderSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    enum: ['SENT', 'PENDING', 'CANCELED'],
    default: 'pending',
  },
  user: {
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: Number,
    address: Address,
  },
  dateOfCreation: {
    type: Date,
    default: Date.now,
  },
  delivery: {
    sentOn: Date,
    sentBy: String,
    invoiceNumber: String,
  },
  items: [
    {
      category: [Language],
      subcategory: [Language],
      model: [Language],
      name: [Language],
      colors: [[Language]],
      pattern: [Language],
      closure: [Language],
      closureColor: String,
      size: {
        heightInCm: Number,
        widthInCm: Number,
        depthInCm: Number,
        volumeInLiters: Number,
        weightInKg: Number,
      },
      bottomMaterial: [Language],
      bottomColor: [Language],
      additions: [[Language]],
      actualPrice: [CurrencySet],
      quantity: Number,
    },
  ],
  totalPrice: [CurrencySet],
  paymentMethod: String,
});

module.exports = mongoose.model('Order', orderSchema);
