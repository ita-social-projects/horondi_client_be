const mongoose = require('mongoose');

const primaryImageSchema = new mongoose.Schema({
    primary: String,
    additional: [String]
});

module.exports = mongoose.model('PrimaryImage', primaryImageSchema)