const mongoose = require('mongoose');
const Size = require('./Size').schema;

const ItemSchema = new mongoose.Schema({
    size: Size,
    components: [
        {
            name: String,
            material: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Material'
            },
            color: Number
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
});

module.exports = mongoose.model('Item', ItemSchema)