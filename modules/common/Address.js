const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  country: String,
  region: String,
  city: String,
  zipcode: String,
  street: String,
  buildingNumber: String,
  appartment: String,
});

module.exports = mongoose.model('Address', addressSchema);
