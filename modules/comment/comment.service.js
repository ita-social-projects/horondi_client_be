const Comment = require('./comment.model');
const RuleError = require('../../errors/rule.error');
const Product = require('../product/product.model');
const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');
const {
  COMMENT_NOT_FOUND,
  COMMENTS_NOT_FOUND,
  COMMENT_FOR_NOT_EXISTING_PRODUCT,
  COMMENT_FOR_NOT_EXISTING_USER,
  RATE_FOR_NOT_EXISTING_PRODUCT,
  REPLY_COMMENT_IS_NOT_PRESENT,
} = require('../../error-messages/comment.messages');
let { minDefaultDate } = require('../../consts/date-range');

class CommentsService {
  async getAllComments({ filter, pagination: { skip, limit } }) {
    const filterOptions = {};
    let maxDate = new Date();
    let minDate = minDefaultDate;

    if (filter?.show?.length) {
      filterOptions.show = { $in: filter.show };
    }

    if (filter?.date?.dateFrom) {
      minDate = new Date(filter.date.dateFrom);
    }

    if (filter?.date?.dateTo) {
      maxDate = new Date(filter.date.dateTo);
    }

    filterOptions.date = {
      $gte: minDate,
      $lte: maxDate,
    };

    if (filter?.search) {
      const search = filter.search.trim();
      filterOptions.text = { $regex: `${search}`, $options: 'i' };
    }

    const items = await Comment.find(filterOptions)
      .sort({ date: -1 })
      .limit(limit)
      .skip(skip)
      .exec();

    const count = Comment.find(filterOptions).countDocuments();

    return {
      items,
      count,
    };
  }

  async getCommentById(id) {
    const comment = await Comment.findById(id).exec();
    if (!comment) {
      throw new RuleError(COMMENT_NOT_FOUND, NOT_FOUND);
    }
    return comment;
  }

  async getRecentComments(limit) {
    const comments = await Comment.find()
      .sort({ date: -1 })
      .limit(limit)
      .exec();
    if (!comments?.length) {
      throw new RuleError(COMMENTS_NOT_FOUND, NOT_FOUND);
    }
    return comments;
  }

  async getAllCommentsByProduct({ productId }) {
    const product = await Product.findById(productId).exec();
    if (product) {
      const comments = await Comment.find({ product: productId }).exec();
      return comments;
    }
    throw new RuleError(COMMENT_NOT_FOUND, NOT_FOUND);
  }

  async getAllCommentsByUser(userId) {
    const comments = await Comment.find({ user: userId }).exec();
    if (comments.length) {
      return comments;
    }
    throw new RuleError(COMMENT_FOR_NOT_EXISTING_USER, BAD_REQUEST);
  }

  async updateComment(id, comment) {
    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { ...comment, updatedAt: Date.now() },
      {
        new: true,
      }
    ).exec();

    if (!updatedComment) {
      throw new RuleError(COMMENT_NOT_FOUND, NOT_FOUND);
    }
    return updatedComment;
  }

  async addComment(data) {
    const product = await Product.findById(data.product).exec();

    if (!product) {
      throw new RuleError(COMMENT_FOR_NOT_EXISTING_PRODUCT, NOT_FOUND);
    }
    return new Comment(data).save();
  }

  async replyForComment(commentId, replyComment) {
    const isCommentExists = await Comment.findById(commentId).exec();

    if (!isCommentExists) {
      throw new RuleError(COMMENT_NOT_FOUND, NOT_FOUND);
    }

    return Comment.findByIdAndUpdate(
      commentId,
      {
        $push: {
          replyComments: replyComment,
        },
      },
      {
        new: true,
      }
    ).exec();
  }

  async updateReplyComment(replyCommentId, replyCommentData) {
    const isReplyCommentPresent = await Comment.findOne({
      'replyComments._id': replyCommentId,
    }).exec();

    if (!isReplyCommentPresent) {
      throw new RuleError(REPLY_COMMENT_IS_NOT_PRESENT, NOT_FOUND);
    }

    return Comment.findOneAndUpdate(
      { 'replyComments._id': replyCommentId },
      {
        $set: {
          'replyComments.$.replyText': replyCommentData?.replyText,
          'replyComments.$.showReplyComment':
            replyCommentData?.showReplyComment,
          'replyComments.$.updatedAt': Date.now(),
        },
      },
      { new: true }
    ).exec();
  }

  async deleteReplyComment(replyCommentId) {
    const isReplyCommentPresent = await Comment.findOne({
      'replyComments._id': replyCommentId,
    }).exec();

    if (!isReplyCommentPresent) {
      throw new RuleError(REPLY_COMMENT_IS_NOT_PRESENT, NOT_FOUND);
    }

    return Comment.findOneAndUpdate(
      { 'replyComments._id': replyCommentId },
      {
        $pull: {
          replyComments: { _id: replyCommentId },
        },
      },
      { new: true }
    ).exec();
  }

  async deleteComment(id) {
    const deletedComment = await Comment.findById(id).exec();

    if (!deletedComment) {
      throw new RuleError(COMMENT_NOT_FOUND, NOT_FOUND);
    }
    return Comment.findByIdAndDelete(id, { new: true }).exec();
  }

  async addRate(id, data, user) {
    const product = await Product.findById(id).exec();

    if (!product) {
      throw new RuleError(RATE_FOR_NOT_EXISTING_PRODUCT, NOT_FOUND);
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

    return Product.findByIdAndUpdate(
      id,
      {
        rateCount,
        rate: newRate.toFixed(1),
        userRates: newUserRates,
      },
      { new: true }
    ).exec();
  }
}

module.exports = new CommentsService();
