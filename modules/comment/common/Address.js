const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  country: {
    type: String,
    minlength: [2, 'error'],
    maxlength: [20, 'error'],
  },
  region: {
    type: String,
    minlength: [2, 'error'],
    maxlength: [20, 'error'],
  },
  city: {
    type: String,
    minlength: [2, 'error'],
    maxlength: [20, 'error'],
  },
  zipcode: {
    type: Number,
    min: [2, 'error'],
    max: [20, 'error'],
  },
  street: {
    type: String,
    minlength: [2, 'error'],
    maxlength: [20, 'error'],
  },
  buildingNumber: {
    type: String,
    minlength: [1, 'error'],
    maxlength: [20, 'error'],
  },
  appartment: {
    type: String,
    minlength: [1, 'error'],
    maxlength: [20, 'error'],
  },
});

module.exports = mongoose.model('Address', addressSchema);
