const mongoose = require('mongoose');

const smallImageSchema = new mongoose.Schema({
    primary: String,
    thumbnail: String
});

module.exports = mongoose.model('SmallImage', smallImageSchema)