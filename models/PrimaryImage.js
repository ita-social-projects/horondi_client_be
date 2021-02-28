const mongoose = require('mongoose');

const ImageSet = require('../modules/common/ImageSet').schema;
const {
  DB_TABLES_NAMES: { PRIMARY_IMAGE },
} = require('../consts/db-tables-names');

const primaryImageSchema = new mongoose.Schema({
  primary: ImageSet,
  additional: [ImageSet],
});

module.exports = mongoose.model(PRIMARY_IMAGE, primaryImageSchema);
