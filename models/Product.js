const mongoose = require('mongoose');
const Language = require('./Language').schema;
const PrimaryImage = require('./PrimaryImage').schema;
const Item = require('./Item').schema;

const productSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    name: [Language],
    description: [Language],
    images: [PrimaryImage],
    rate: Number,
    rateCount: Number,
    votedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    basePrice: Number,
    items: [Item],
    available: Boolean,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});

module.exports = mongoose.model('Product', productSchema)