const Comment = require('./comment.model');
const RuleError = require('../../errors/rule.error');
const Product = require('../product/product.model');
const Order = require('../order/order.model');
const User = require('../user/user.model');
const {
  STATUS_CODES: { NOT_FOUND },
} = require('../../consts/status-codes');
const {
  COMMENT_NOT_FOUND,
  COMMENTS_NOT_FOUND,
  COMMENT_FOR_NOT_EXISTING_PRODUCT,
  COMMENT_FOR_NOT_EXISTING_USER,
  RATE_FOR_NOT_EXISTING_PRODUCT,
  REPLY_COMMENT_IS_NOT_PRESENT,
} = require('../../error-messages/comment.messages');
const { minDefaultDate } = require('../../consts/date-range');

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

  async addComment(data, user) {
    const product = await Product.findById(data.product).exec();

    if (!product) {
      throw new RuleError(COMMENT_FOR_NOT_EXISTING_PRODUCT, NOT_FOUND);
    }
    const order = await Order.find({
      'items.product': data.product,
      'user.email': user.email,
    }).exec();

    if (order.length > 0) {
      data.isSelled = true;
    }
    const comment = await new Comment(data).save();

    User.findByIdAndUpdate(
      user._id,
      { $push: { comments: comment._id } },
      { new: true }
    ).exec();
    Product.findByIdAndUpdate(
      data.product,
      {
        $push: { comments: comment._id },
      },
      { new: true }
    ).exec();
    return comment;
  }

  async replyForComment(commentId, replyComment, user) {
    const isCommentExists = await Comment.findById(commentId).exec();

    if (!isCommentExists) {
      throw new RuleError(COMMENT_NOT_FOUND, NOT_FOUND);
    }

    const order = await Order.find({
      'items.product': replyComment.productId,
      'user.email': user.email,
    }).exec();

    if (order.length > 0) {
      replyComment.isSelled = true;
      replyComment.qwerty = true;
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
    return Comment.findByIdAndDelete(id).exec();
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
