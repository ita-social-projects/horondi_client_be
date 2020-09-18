const commentsService = require('./comment.service');
const { COMMENT_NOT_FOUND } = require('../../error-messages/comment.messages');

const commentsQuery = {
  getCommentById: async (parent, args) => {
    const comment = await commentsService.getCommentById(args.id);
    if (comment) {
      return comment;
    }
    return {
      statusCode: 404,
      message: COMMENT_NOT_FOUND,
    };
  },

  getAllCommentsByProduct: async (parent, args) => {
    try {
      return await commentsService.getAllCommentsByProduct(args.productId);
    } catch (error) {
      return [
        {
          statusCode: 404,
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
      return [
        {
          statusCode: 404,
          message: error.message,
        },
      ];
    }
  },
  deleteComment: async (parent, args) => {
    try {
      return await commentsService.deleteComment(args.id);
    } catch (error) {
      return {
        statusCode: 404,
        message: error.message,
      };
    }
  },
  updateComment: async (parent, args) => {
    try {
      return await commentsService.updateComment(args.id, args.comment);
    } catch (error) {
      return {
        statusCode: 404,
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
        statusCode: 400,
        message: error.message,
      };
    }
  },
};

module.exports = { commentsQuery, commentsMutation };
