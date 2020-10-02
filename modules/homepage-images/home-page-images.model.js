const mongoose = require('mongoose');
const ImageSet = require('../common/ImageSet').schema;

module.exports = mongoose.model('HomePageImages', ImageSet);
