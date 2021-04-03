const mongoose = require('mongoose');

const {
  DB_COLLECTIONS_NAMES: { HISTORY, USER },
} = require('../../consts/db-collections-names');
const { HISTORY_ACTIONS } = require('../../consts/history-actions');

const historySchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: Object.values(HISTORY_ACTIONS),
  },
  subject: {
    name: {
      type: String,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  valueBeforeChange: [String],
  valueAfterChange: [String],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: USER,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model(HISTORY, historySchema);
