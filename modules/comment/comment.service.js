const Comment = require('./comment.model');
const Product = require('../product/product.model');
const User = require('../user/user.model');
const {
  COMMENT_NOT_FOUND,
  COMMENT_FOR_NOT_EXISTING_PRODUCT,
  RATE_FOR_NOT_EXISTING_PRODUCT,
} = require('../../error-messages/comment.messages');

const { monthInMilliseconds } = require('../../consts');
const { UserRate } = require('../../resolvers');
const { USER_NOT_FOUND } = require('../../error-messages/user.messages');

class CommentsService {
  async getCommentById(id) {
    const comment = await Comment.findById(id);
    if (!comment) {
      throw new Error(COMMENT_NOT_FOUND);
    }
    return comment;
  }

  async getAllCommentsByProduct(id) {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error(COMMENT_NOT_FOUND);
    }
    return Comment.find({ product: id });
  }

  async getAllCommentsByUser(userEmail) {
    const user = await User.find({ email: userEmail });

    if (!user.length) {
      throw new Error(USER_NOT_FOUND);
    }
    return await Comment.find({ 'user.email': userEmail });
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
    return new Comment(data).save();
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

    if (!product) {
      throw new Error(RATE_FOR_NOT_EXISTING_PRODUCT);
    }
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
    return rateToAdd;
  }
}
module.exports = new CommentsService();
