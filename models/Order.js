const mongoose = require('mongoose');
const item = require('./item').schema;

const orderSchema = new mongoose.Schema({
    
    status: {
        type: String,
        required: true,
        enum: [
           "delivered",
            "pending",
            "canceled"              
        ]
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
    dateOfCreation: Date,
    dateOfDelivery: Date,
    items:[item],
    product: String
   
}
);

module.exports = mongoose.model('Order', orderSchema)