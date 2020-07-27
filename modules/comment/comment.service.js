const Comments = require('./comment.model');

class CommentsService {
  getAllComments() {
    return Comments.find();
  }

  getCommentById(id) {
    return Comments.findById(id);
  }

  getAllCommentsByProduct(id) {
    return Comments.find({ product: id });
  }

  updateComment(id, comments) {
    return Comments.findByIdAndUpdate(id, comments);
  }

  addComment(data) {
    const comments = new Comments(data);
    return comments.save();
  }

  deleteComment(id) {
    return Comments.findByIdAndDelete(id);
  }
}
module.exports = new CommentsService();
