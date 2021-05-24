const mongoose = require('mongoose');

const {
  DB_COLLECTIONS_NAMES: { RESTRICTION },
} = require('../../consts/db-collections-names');
const {
  RESTRICTION_EXPRESSION_NAMES: { IS_EQUAL, IS_NOT_EQUAL },
} = require('../../consts/restriction-expression-names');

const restrictionSchema = new mongoose.Schema({
  compareByExpression: {
    type: String,
    enum: [IS_EQUAL, IS_NOT_EQUAL],
    required: true,
  },
  options: [
    {
      option: {
        type: mongoose.Schema.Types.ObjectId,
      },
      feature: String,
    },
  ],
});

module.exports = mongoose.model(RESTRICTION, restrictionSchema);
