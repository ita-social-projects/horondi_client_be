const Comment = require('./comment.model');
const Product = require('../product/product.model');
const {
  COMMENT_NOT_FOUND,
  COMMENT_FOR_NOT_EXISTING_PRODUCT,
  RATE_NOT_FOUND,
  RATE_FOR_NOT_EXISTING_PRODUCT,
} = require('../../error-messages/comment.messages');

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

  async addRate(id, data) {
    const product = await Product.findById(id);
    let { rateCount } = product;
    const rateSum = product.rate * rateCount + data.rate;
    const newRate = rateSum / ++rateCount;

    const rateToAdd = await Product.findByIdAndUpdate(
      id,
      {
        rate: newRate.toFixed(2),
        rateCount: rateCount++,
        userRates: [...product.userRates, data],
      },
      { new: true },
    );

    if (rateToAdd) return rateToAdd;
    throw new Error(RATE_FOR_NOT_EXISTING_PRODUCT);
  }

  async updateRate(id, data) {
    const product = await Product.findById(id);
    const { rateCount, userRates } = product;
    const { rate } = userRates.find(({ user }) => String(user) === data.user);
    const rateSum = product.rate * rateCount - rate + data.rate;
    const newRate = rateSum / rateCount;

    const newUserRates = userRates.map(item => (String(item.user) === data.user
      ? { user: item.user, rate: data.rate }
      : item));

    const rateToUpdate = await Product.findByIdAndUpdate(
      id,
      {
        rate: newRate.toFixed(2),
        userRates: newUserRates,
      },
      { new: true },
    );

    if (rateToUpdate) return rateToUpdate;
    throw new Error(RATE_NOT_FOUND);
  }
}
module.exports = new CommentsService();
