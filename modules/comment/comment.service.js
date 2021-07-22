const Comment = require('./comment.model');
const RuleError = require('../../errors/rule.error');
const Product = require('../product/product.model');
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
  REPLY_COMMENTS_NOT_FOUND,
  REPLY_COMMENT_NOT_FOUND,
} = require('../../error-messages/comment.messages');
const {
  ORDER_STATUSES: { DELIVERED },
} = require('../../consts/order-statuses');
const {
  isUserBoughtProduct,
  filteredReplyComments,
  filterOptionComments,
} = require('../helper-functions');

class CommentsService {
  async getAllComments({ filter, pagination: { skip, limit }, sort }) {
    const filterOptions = filterOptionComments(filter);
    let sortLabel = sort;
    if (Object.keys(sort).includes('replyComments')) {
      sortLabel = { 'replyComments.createdAt': sort.replyComments };
    }
    const items = await Comment.find(filterOptions)
      .sort(sortLabel)
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

  async getReplyCommentById(id) {
    const replyComment = await Comment.findOne({
      'replyComments._id': id,
    }).exec();

    if (!replyComment) {
      throw new RuleError(REPLY_COMMENT_NOT_FOUND, NOT_FOUND);
    }
    replyComment.replyComments = replyComment.replyComments.filter(
      el => el._id.toString() === id
    );
    return replyComment;
  }

  async getRecentComments(limit) {
    const comments = await Comment.find()
      .sort({ date: -1 })
      .limit(limit)
      .exec();
    if (!comments?.length) {
      throw new RuleError(COMMENT_NOT_FOUND, NOT_FOUND);
    }
    return comments;
  }

  async getCommentsByProduct(filter, skip, limit, user, sort) {
    const product = await Product.findById(filter.productId).exec();
    if (!product) {
      throw new RuleError(COMMENTS_NOT_FOUND, NOT_FOUND);
    }
    let filterOptions = {};

    if (filter.filters) {
      filterOptions = filterOptionComments(filter);
    } else if (user) {
      filterOptions = {
        $and: [
          { $or: [{ show: { $in: [true] } }, { user: user._id }] },
          { product: filter.productId },
        ],
      };
    } else {
      filterOptions = { show: { $in: [true] }, product: filter.productId };
    }
    let sortLabel = sort;
    if (sortLabel && Object.keys(sort).includes('replyComments')) {
      sortLabel = { 'replyComments.createdAt': sort.replyComments };
    }
    if (sortLabel === undefined) {
      sortLabel = { date: -1 };
    }
    const count = Comment.find(filterOptions).countDocuments();
    const items = await Comment.find(filterOptions)
      .sort(sortLabel)
      .limit(limit)
      .skip(skip)
      .exec();

    return {
      items,
      count,
    };
  }

  async getReplyCommentsByComment(filter, skip, limit, user, sort) {
    const comment = await Comment.findById(filter.commentId).exec();
    if (!comment) {
      throw new RuleError(REPLY_COMMENTS_NOT_FOUND, NOT_FOUND);
    }
    if (filter.filters) {
      comment.replyComments = filteredReplyComments(
        filter,
        comment.replyComments
      );
    } else if (user) {
      comment.replyComments = comment.replyComments.filter(
        item =>
          item.showReplyComment === true ||
          item.answerer.toString() === user._id.toString()
      );
    } else {
      comment.replyComments = comment.replyComments.filter(
        item => item.showReplyComment === true
      );
    }
    if (parseInt(sort?.date) === 1) {
      comment.replyComments = comment.replyComments.sort(
        (a, b) => a.createdAt - b.createdAt
      );
    } else if (parseInt(sort?.date) === -1) {
      comment.replyComments = comment.replyComments.sort(
        (a, b) => b.createdAt - a.createdAt
      );
    }
    const countAll = comment.replyComments.length;
    comment.replyComments = comment.replyComments.slice(skip, skip + limit);
    return {
      items: [comment],
      count: comment.replyComments.length,
      countAll,
    };
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

  async addComment(data, { _id: userId }) {
    const product = await Product.findById(data.product).exec();

    if (!product) {
      throw new RuleError(COMMENT_FOR_NOT_EXISTING_PRODUCT, NOT_FOUND);
    }
    const order = await isUserBoughtProduct(data.product, userId);

    if (order.some(item => item.status === DELIVERED)) {
      data.verifiedPurchase = true;
    }
    return new Comment(data).save();
  }

  async replyForComment(commentId, replyComment, { _id: userId }) {
    const isCommentExists = await Comment.findById(commentId).exec();

    if (!isCommentExists) {
      throw new RuleError(COMMENT_NOT_FOUND, NOT_FOUND);
    }

    const order = await isUserBoughtProduct(replyComment.productId, userId);

    if (order.some(item => item.status === DELIVERED)) {
      replyComment.verifiedPurchase = true;
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
