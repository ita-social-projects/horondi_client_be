const commentsService = require('./comment.service');
const RuleError = require('../../errors/rule.error');

const commentsQuery = {
  getAllComments: (parent, args) => {
    try {
      return commentsService.getAllComments(args);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  getCommentById: async (parent, { id }) => {
    try {
      return await commentsService.getCommentById(id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getReplyCommentById: async (_, { id }) => {
    try {
      return await commentsService.getReplyCommentById(id);
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
  getReplyCommentsByComment: async (
    parent,
    { filter, pagination: { skip, limit }, sort },
    { user }
  ) => {
    try {
      return await commentsService.getReplyCommentsByComment(
        filter,
        skip,
        limit,
        user,
        sort
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  getCommentsByProduct: async (
    parent,
    { filter, pagination: { skip, limit }, sort },
    { user }
  ) => {
    try {
      return await commentsService.getCommentsByProduct(
        filter,
        skip,
        limit,
        user,
        sort
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  getAllCommentsByUser: async (parent, args) => {
    try {
      return await commentsService.getAllCommentsByUser(args.userId);
    } catch (error) {
      return [
        {
          statusCode: error.statusCode,
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
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { commentsQuery, commentsMutation };
