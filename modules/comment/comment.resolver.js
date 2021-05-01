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
    } catch (error) {
      return new RuleError(error.message, error.statusCode);
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
      const errs = Array(new RuleError(error.message, error.statusCode));
      return errs;
    }
  },

  getAllCommentsByUser: async (parent, args) => {
    try {
      return await commentsService.getAllCommentsByUser(args.userId);
    } catch (error) {
      const errs = Array(new RuleError(error.message, error.statusCode));
      return errs;
    }
  },
};

const commentsMutation = {
  addComment: async (parent, args) => {
    try {
      return await commentsService.addComment(args.productId, args.comment);
    } catch (error) {
      return new RuleError(error.message, error.statusCode);
    }
  },

  deleteComment: async (parent, args) => {
    try {
      return await commentsService.deleteComment(args.id);
    } catch (error) {
      return new RuleError(error.message, error.statusCode);
    }
  },

  updateComment: async (parent, args) => {
    try {
      return await commentsService.updateComment(args.id, args.comment);
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
      return new RuleError(error.message, error.statusCode);
    }
  },
};

module.exports = { commentsQuery, commentsMutation };
