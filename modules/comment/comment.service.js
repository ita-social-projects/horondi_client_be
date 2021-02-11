const Comment = require('./comment.model');
const Product = require('../product/product.model');
const {
  COMMENT_NOT_FOUND,
  COMMENT_FOR_NOT_EXISTING_PRODUCT,
  COMMENT_FOR_NOT_EXISTING_USER,
  RATE_FOR_NOT_EXISTING_PRODUCT,
} = require('../../error-messages/comment.messages');

const { monthInMilliseconds } = require('../../consts');

class CommentsService {
  async getAllComments({ skip, limit }) {
    const comments = await Comment.find()
      .skip(skip)
      .limit(limit)
      .exec();
    const count = await Comment.find()
      .countDocuments()
      .exec();
    return { items: comments, count };
  }
  async getCommentById(id) {
    const comment = await Comment.findById(id).exec();
    if (!comment) {
      throw new Error(COMMENT_NOT_FOUND);
    }
    return comment;
  }

  async getAllCommentsByProduct({ productId, skip, limit }) {
    const product = await Product.findById(productId).exec();
    if (!product) {
      throw new Error(COMMENT_NOT_FOUND);
    }
    const comments = await Comment.find({ product: productId })
      .skip(skip)
      .limit(limit)
      .sort('-date')
      .exec();
    const count = await Comment.find({ product: productId })
      .countDocuments()
      .exec();
    return { items: comments, count };
  }

  async getAllCommentsByUser(userId) {
    const comments = await Comment.find({ user: userId }).exec();
    if (!comments.length) {
      throw new Error(COMMENT_FOR_NOT_EXISTING_USER);
    }
    return comments;
  }

  async updateComment(id, comment) {
    const updatedComment = await Comment.findByIdAndUpdate(id, comment, {
      new: true,
    }).exec();
    if (!updatedComment) {
      throw new Error(COMMENT_NOT_FOUND);
    }
    return updatedComment;
  }

  async addComment(id, data) {
    const product = await Product.findById(id).exec();
    if (!product) {
      throw new Error(COMMENT_FOR_NOT_EXISTING_PRODUCT);
    }
    return new Comment(data).save();
  }

  async deleteComment(id) {
    const deletedComment = await Comment.findByIdAndDelete(id).exec();
    if (!deletedComment) {
      throw new Error(COMMENT_NOT_FOUND);
    }
    return deletedComment;
  }

  async addRate(id, data, user) {
    const product = await Product.findById(id).exec();

    if (!product) {
      throw new Error(RATE_FOR_NOT_EXISTING_PRODUCT);
    }
    const { userRates } = product;
    let { rateCount } = product;

    const { rate } =
      userRates.find(rating => String(rating.user) === String(user._id)) || {};

    const rateSum = product.rate * rateCount - (rate || !!rate) + data.rate;
    if (!rate) {
      rateCount++;
    }
    const newRate = rateSum / rateCount;

    const newUserRates = rate
      ? userRates.map(item =>
          String(item.user) === String(user._id)
            ? { user: item.user, rate: data.rate }
            : item
        )
      : [...userRates, { ...data, user: user._id }];

    const rateToAdd = await Product.findByIdAndUpdate(
      id,
      {
        rateCount,
        rate: newRate.toFixed(1),
        userRates: newUserRates,
      },
      { new: true }
    ).exec();
    return rateToAdd;
  }
}
module.exports = new CommentsService();
