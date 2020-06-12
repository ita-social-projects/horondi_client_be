const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    country: String,
    city: String,
    street: String,
    buildingNumber: String,
    appartment: String,
});

module.exports = mongoose.model('Address', addressSchema)