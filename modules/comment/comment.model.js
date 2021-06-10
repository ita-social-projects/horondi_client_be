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
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: USER,
  },
  email: {
    type: String,
  },
  userName: {
    type: String,
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
      showReplyComment: {
        type: Boolean,
        default: false,
      },
      answerer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: USER,
      },
      refToReplyComment: {
        type: mongoose.Schema.Types.ObjectId,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
      isSelled: {
        type: Boolean,
        default: false,
      },
    },
  ],
  show: {
    type: Boolean,
    default: false,
  },
  rate: Number,
  isSelled: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model(COMMENT, commentSchema);
