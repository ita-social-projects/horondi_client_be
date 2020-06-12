const mongoose = require('mongoose');
const Language = require('./Language').schema;
const PrimaryImage = require('./PrimaryImage').schema;
const Size = require('./Size').schema;

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
    items: [{
        size: Size,
        components: [
            {
                name: String,
                material: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Material'
                },
                colorCode: Number
            }
        ],
        pattern: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Pattern'
        },
        pocket: Boolean,
        closure: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Closure'
        },
        closureColorCode: Number,
        actualPrice: Number,
        availableNumber: Number
    }],
    available: Boolean,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});

module.exports = mongoose.model('Product', productSchema)