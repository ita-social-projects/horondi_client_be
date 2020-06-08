const { Schema, model } = require('mongoose');

const CommentSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'product',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Comment = model('comment', CommentSchema);

module.exports = Comment;
