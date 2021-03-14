const Comment = require('./comment.model');
const Product = require('../product/product.model');
const {
  COMMENT_NOT_FOUND,
  COMMENT_FOR_NOT_EXISTING_PRODUCT,
  COMMENT_FOR_NOT_EXISTING_USER,
  RATE_FOR_NOT_EXISTING_PRODUCT,
} = require('../../error-messages/comment.messages');

const FilterHelper = require('../../helpers/filter-helper');
const {
  LOCALES: { UK },
} = require('../../consts/locations');
const {
  COUNTS: { COUNT },
} = require('../../consts/comments-operations');

class CommentsService extends FilterHelper {
  async getAllComments({ filter, pagination }) {
    let filters = this.filterItems(filter);
    let aggregatedItems = this.aggregateItems(filters, pagination);
    const [comments] = await Comment.aggregate()
      .collation({ locale: UK })
      .facet({
        items: aggregatedItems,
        calculations: [{ $match: filters }, { $count: COUNT }],
      })
      .exec();

    let commentsCount;

    const {
      items,
      calculations: [calculations],
    } = comments;
    if (calculations) {
      commentsCount = calculations.count;
    }
    return {
      items,
      count: commentsCount || 0,
    };
  }

  async getRecentComments({ comentDate }) {
    const comment = await Comment.find(comentDate).exec();
    if (!comment) {
      throw new Error(COMMENT_NOT_FOUND);
    }
    return comment;
  }

  async getCommentById(id) {
    const comment = await Comment.findById(id).exec();
    if (!comment) {
      throw new Error(COMMENT_NOT_FOUND);
    }
    return comment;
  }

  async getAllCommentsByProduct({ productId }) {
    const product = await Product.findById(productId).exec();
    if (!product) {
      throw new Error(COMMENT_NOT_FOUND);
    }
    const comments = await Comment.find({ product: productId }).exec();
    return comments;
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
