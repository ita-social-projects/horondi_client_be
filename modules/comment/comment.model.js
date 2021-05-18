const mongoose = require('mongoose');

const {
  DB_COLLECTIONS_NAMES: { COMMENT, PRODUCT, USER },
} = require('../../consts/db-collections-names');

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: USER,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: PRODUCT,
  },
  replyComments: [
    {
      replyText: {
        type: String,
      },
      answerer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: USER,
      },
      refToReplyComment: {
        type: mongoose.Schema.Types.ObjectId,
        default: '',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  show: Boolean,
});

module.exports = mongoose.model(COMMENT, commentSchema);
