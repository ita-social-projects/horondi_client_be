const Comments = require('./comment.model');
const Product = require('../product/product.model');
const { COMMENT_NOT_FOUND } = require('../../error-messages/comment.messages');

class CommentsService {
  getCommentById(id) {
    return Comments.findById(id);
  }

  async getAllCommentsByProduct(id) {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error(COMMENT_NOT_FOUND);
    }
    return Comments.find({ product: id });
  }

  updateComment(id, comment) {
    return Comments.findByIdAndUpdate(id, comment, { new: true });
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
