const commentsService = require('./comment.service');

const commentsQuery = {
  getAllComments: () => commentsService.getAllComments(),
  getCommentById: (parent, args) => commentsService.getCommentById(args.id),
};

const commentsMutation = {
  addComment: (parent, args) => commentsService.addComment(args.comment),
  deleteComment: (parent, args) => commentsService.deleteComment(args.id),
  updateComment: (parent, args) => commentsService.updateComment(args.id, args.comment),
};

module.exports = { commentsQuery, commentsMutation };
