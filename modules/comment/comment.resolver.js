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

  getAllCommentsByProduct: async (_, { productId }) => {
    try {
      return await commentsService.getAllCommentsByProduct(productId);
    } catch (error) {
      return new RuleError(error.message, error.statusCode);
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
  addComment: async (_, { comment }) => {
    try {
      return await commentsService.addComment(comment);
    } catch (error) {
      return new RuleError(error.message, error.statusCode);
    }
  },
  replyForComment: async (_, { commentId, replyComment }) => {
    try {
      return await commentsService.replyForComment(commentId, replyComment);
    } catch (error) {
      return new RuleError(error.message, error.statusCode);
    }
  },

  deleteComment: async (parent, args) => {
    try {
      return await commentsService.deleteComment(args.id);
    } catch (error) {
      return {
        statusCode: NOT_FOUND,
        message: error.message,
      };
    }
  },

  updateComment: async (parent, args) => {
    try {
      return await commentsService.updateComment(args.id, args.comment);
    } catch (error) {
      return {
        statusCode: NOT_FOUND,
        message: error.message,
      };
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
