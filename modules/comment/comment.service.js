const Comment = require('./comment.model');
const Product = require('../product/product.model');

const {
  COMMENT_NOT_FOUND,
  COMMENT_FOR_NOT_EXISTING_PRODUCT,
  RATE_FOR_NOT_EXISTING_PRODUCT,
} = require('../../error-messages/comment.messages');

const { monthInMilliseconds } = require('../../consts');

class CommentsService {
  getCommentById(id) {
    return Comment.findById(id);
  }

  async getAllCommentsByProduct(id) {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error(COMMENT_NOT_FOUND);
    }
    return Comment.find({ product: id });
  }

  async getAllCommentsByUser(userEmail) {
    return await Comment.find({ 'user.email': userEmail });
  }

  async getAllRecentComments({ skip, limit }) {
    const dateFrom = new Date().getTime();
    const dateTo = dateFrom - monthInMilliseconds;

    const items = await Comment.find({ date: { $lt: dateFrom, $gt: dateTo } })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const count = await Comment.find({
      date: { $gt: dateTo, $lt: dateFrom },
    }).countDocuments();

    return {
      items,
      count,
    };
  }

  async updateComment(id, comment) {
    const updatedComment = await Comment.findByIdAndUpdate(id, comment, {
      new: true,
    });
    if (!updatedComment) {
      throw new Error(COMMENT_NOT_FOUND);
    }
    return updatedComment;
  }

  async addComment(id, data) {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error(COMMENT_FOR_NOT_EXISTING_PRODUCT);
    }
    const comment = new Comment(data);
    return comment.save();
  }

  async deleteComment(id) {
    const deletedComment = await Comment.findByIdAndDelete(id);
    if (!deletedComment) {
      throw new Error(COMMENT_NOT_FOUND);
    }
    return deletedComment;
  }

  async addRate(id, data, user) {
    const product = await Product.findById(id);
    const { userRates } = product;
    let { rateCount } = product;
    const { rate } =
      userRates.find(rate => String(rate.user) === String(user._id)) || {};

    const rateSum = product.rate * rateCount - (rate || !!rate) + data.rate;
    rateCount = rate ? rateCount : ++rateCount;
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
    );

    if (rateToAdd) return rateToAdd;
    throw new Error(RATE_FOR_NOT_EXISTING_PRODUCT);
  }
}
module.exports = new CommentsService();
