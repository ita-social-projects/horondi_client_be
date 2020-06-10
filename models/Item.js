const mongoose = require('mongoose');
const Size = require('./Size').schema;
const Component = require('./Component').schema;

const ItemSchema = new mongoose.Schema({
    size: Size,
    component: [Component],
    pattern: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pattern'
    },
    pocket: Boolean,
    closure: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Closure'
    },
    actualPrice: Number,
    availableNumber: Number
});

module.exports = mongoose.model('Item', ItemSchema)