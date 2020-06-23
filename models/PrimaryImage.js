const mongoose = require('mongoose');
const ImageSet = require('./ImageSet').schema;

const primaryImageSchema = new mongoose.Schema({
  primary: ImageSet,
  additional: [ImageSet],
});

module.exports = mongoose.model('PrimaryImage', primaryImageSchema);
