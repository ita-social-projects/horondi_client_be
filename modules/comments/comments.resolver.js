const commentsService = require('./comments.service');

const commentsQuery = {
  getAllComments: () => commentsService.getAllComments(),
  getCommentsById: (parent, args) => commentsService.getCommentsById(args.id),
};

const commentsMutation = {
  addComments: (parent, args) => commentsService.addComments(args.comments),
  deleteCommentsById: (parent, args) => commentsService.deleteComments(args.id),
  updateCommentsById: (parent, args) => commentsService.updateCommentsById(args.id, args.comments),
};

module.exports = { commentsQuery, commentsMutation };
