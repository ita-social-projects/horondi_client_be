const commentsService = require('./comment.service');
const RuleError = require('../../errors/rule.error');
const {
  STATUS_CODES: { NOT_FOUND },
} = require('../../consts/status-codes');

const commentsQuery = {
  getAllComments: (parent, args) => commentsService.getAllComments(args),
  getCommentById: async (parent, args) => {
    try {
      return await commentsService.getCommentById(args.id);
    } catch (e) {
      return {
        statusCode: NOT_FOUND,
        message: e.message,
      };
    }
  },

  getRecentComments: (_, { limit }) => {
    try {
      return commentsService.getRecentComments(limit);
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
  addComment: async (parent, args) => {
    try {
      return await commentsService.addComment(args.productId, args.comment);
    } catch (error) {
      return {
        statusCode: NOT_FOUND,
        message: error.message,
      };
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
