const Comments = require('./comments.model');

class CommentsService {
  getAllComments() {
    return Comments.find();
  }

  getCommentsById(id) {
    return Comments.findById(id);
  }

  updateCommentsById(id, comments) {
    return Comments.findByIdAndUpdate(id, comments);
  }

  addComments(data) {
    const comments = new Comments(data);
    return comments.save();
  }

  deleteComments(id) {
    return Comments.findByIdAndDelete(id);
  }
}
module.exports = new CommentsService();
