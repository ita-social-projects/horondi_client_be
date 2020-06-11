const mongoose = require('mongoose');
const Item = require('./Item').schema;

const orderSchema = new mongoose.Schema({
    status: {
        type: String,
        required: true,
        enum: [
            "sent",
            "pending",
            "canceled"
        ],
        default: "pending"
    },
    user:
    {
        firstName: String,
        lastName: String,
        email: String,
        phoneNumber: String,
        address:
        {
            country: String,
            city: String,
            street: String,
            buildingNumber: String,
            appartment: String
        }
    },
    dateOfCreation: {
        type: Date,
        default: Date.now
    },
    dateOfDelivery: Date,
    deliveryType: String,
    invoiceNumber: String,
    items: [
        {
            product: String,
            item: Item
        }
    ],
    totalPrice: Number
}
);

module.exports = mongoose.model('Order', orderSchema)