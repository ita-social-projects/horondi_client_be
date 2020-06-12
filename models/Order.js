const mongoose = require('mongoose');
const Language = require('./Language').schema;
const Address = require('./Address').schema;
const Size = require('./Size').schema;

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
        phoneNumber: Number,
        address: Address
    },
    dateOfCreation: {
        type: Date,
        default: Date.now
    },
    delivery: {
        sentOn: Date,
        sentBy: String,
        invoiceNumber: String,
    },
    items: [{
        product: [Language],
        size: Size,
        components: [
            {
                name: [Language],
                material: [Language],
                color: [Language]
            }
        ],
        pattern: [Language],
        pocket: Boolean,
        closure: [Language],
        closureColor: [Language],
        actualPrice: Number,
        quantity: Number
    }],
    totalPrice: Number,
    paymentMethod: String
});

module.exports = mongoose.model('Order', orderSchema)