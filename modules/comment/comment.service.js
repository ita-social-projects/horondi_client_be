const Comments = require('./comment.model');
const Product = require('../product/product.model');
const {
  COMMENT_NOT_FOUND,
  COMMENT_FOR_NOT_EXISTING_PRODUCT,
} = require('../../error-messages/comment.messages');

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

  async addComment(id, data) {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error(COMMENT_FOR_NOT_EXISTING_PRODUCT);
    }
    const comments = new Comments(data);
    return comments.save();
  }

  async deleteComment(id) {
    const commentToDelete = await Comments.findByIdAndDelete(id);
    if (commentToDelete) {
      return commentToDelete;
    }
    throw new Error(COMMENT_NOT_FOUND);
  }
}
module.exports = new CommentsService();
