const mongoose = require('mongoose');

const {
  DB_COLLECTIONS_NAMES: { HISTORY, USER },
} = require('../../consts/db-collections-names');
const {
  HISTORY_ACTIONS,
  HISTORY_NAMES,
} = require('../../consts/history-actions');

const historySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: Object.values(HISTORY_ACTIONS),
    },
    historyName: {
      type: String,
      required: true,
      enum: Object.values(HISTORY_NAMES),
    },
    subject: {
      model: {
        type: String,
        default: '',
      },
      name: {
        type: String,
      },
      subjectId: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
    valueBeforeChange: [Object],
    valueAfterChange: [Object],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: USER,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(HISTORY, historySchema);
