const commentsService = require('./comment.service');
const RuleError = require('../../errors/rule.error');
const {
  STATUS_CODES: { NOT_FOUND },
} = require('../../consts/status-codes');

const commentsQuery = {
  getAllComments: (parent, args) => commentsService.getAllComments(args),
  getCommentById: async (parent, { id }) => {
    try {
      return await commentsService.getCommentById(id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  getRecentComments: async (_, { limit }) => {
    try {
      return await commentsService.getRecentComments(limit);
    } catch (error) {
      return new RuleError(error.message, error.statusCode);
    }
  },

  getAllCommentsByProduct: async (parent, args) => {
    try {
      return await commentsService.getAllCommentsByProduct(args);
    } catch (error) {
      return [
        {
          statusCode: NOT_FOUND,
          message: error.message,
        },
      ];
    }
  },

  getAllCommentsByUser: async (parent, args) => {
    try {
      return await commentsService.getAllCommentsByUser(args.userId);
    } catch (error) {
      return [
        {
          statusCode: NOT_FOUND,
          message: error.message,
        },
      ];
    }
  },
};

const commentsMutation = {
  addComment: async (_, { comment }, { user }) => {
    try {
      return await commentsService.addComment(comment, user);
    } catch (error) {
      return new RuleError(error.message, error.statusCode);
    }
  },
  replyForComment: async (_, { commentId, replyCommentData }, { user }) => {
    try {
      return await commentsService.replyForComment(
        commentId,
        replyCommentData,
        user
      );
    } catch (error) {
      return new RuleError(error.message, error.statusCode);
    }
  },
  updateReplyForComment: async (_, { replyCommentId, replyCommentData }) => {
    try {
      return await commentsService.updateReplyComment(
        replyCommentId,
        replyCommentData
      );
    } catch (error) {
      return new RuleError(error.message, error.statusCode);
    }
  },
  deleteReplyForComment: async (_, { replyCommentId }) => {
    try {
      return await commentsService.deleteReplyComment(replyCommentId);
    } catch (error) {
      return new RuleError(error.message, error.statusCode);
    }
  },

  deleteComment: async (_, { commentID }) => {
    try {
      return await commentsService.deleteComment(commentID);
    } catch (error) {
      return new RuleError(error.message, error.statusCode);
    }
  },

  updateComment: async (parent, { id, comment }) => {
    try {
      return await commentsService.updateComment(id, comment);
    } catch (error) {
      return new RuleError(error.message, error.statusCode);
    }
  },

  addRate: async (parent, args, context) => {
    try {
      return await commentsService.addRate(
        args.product,
        args.userRate,
        context.user
      );
    } catch (error) {
      return {
        statusCode: NOT_FOUND,
        message: error.message,
      };
    }
  },
};

module.exports = { commentsQuery, commentsMutation };
