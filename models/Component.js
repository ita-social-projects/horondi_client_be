const mongoose = require('mongoose');

const ComponentSchema = new mongoose.Schema({
    name: String,
    material: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Material'
    },
    color: Number
});

module.exports = mongoose.model('Component', ComponentSchema)