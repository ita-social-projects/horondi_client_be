const commentsService = require('./comment.service');

const commentsQuery = {
  getAllComments: (parent, args) => commentsService.getAllComments(args),
  getCommentById: async (parent, args) => {
    try {
      return await commentsService.getCommentById(args.id);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },

  getAllCommentsByProduct: async (parent, args) => {
    try {
      return await commentsService.getAllCommentsByProduct(args);
    } catch (error) {
      console.log(error);
      return [
        {
          statusCode: 404,
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
          statusCode: 404,
          message: error.message,
        },
      ];
    }
  },

  getAllRecentComments: async (parent, args) =>
    commentsService.getAllRecentComments(args),
};

const commentsMutation = {
  addComment: async (parent, args) => {
    try {
      return await commentsService.addComment(args.productId, args.comment);
    } catch (error) {
      return {
        statusCode: 404,
        message: error.message,
      };
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
        statusCode: 404,
        message: error.message,
      };
    }
  },
};

module.exports = { commentsQuery, commentsMutation };
