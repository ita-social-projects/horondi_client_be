const Comment = require('./comment.model');
const Product = require('../product/product.model');
const {
  COMMENT_NOT_FOUND,
  COMMENT_FOR_NOT_EXISTING_PRODUCT,
} = require('../../error-messages/comment.messages');

class CommentsService {
  getCommentById(id) {
    return Comment.findById(id);
  }

  async getAllCommentsByProduct(id) {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error(COMMENT_NOT_FOUND);
    }
    return Comment.find({ product: id });
  }

  async updateComment(id, comment) {
    const commentToUpdate = Comment.findByIdAndUpdate(id, comment, {
      new: true,
    });
    if (commentToUpdate) {
      return commentToUpdate;
    }
    throw new Error(COMMENT_NOT_FOUND);
  }

  async addComment(id, data) {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error(COMMENT_FOR_NOT_EXISTING_PRODUCT);
    }
    const comment = new Comment(data);
    return comment.save();
  }

  async deleteComment(id) {
    const commentToDelete = await Comment.findByIdAndDelete(id);
    if (commentToDelete) {
      return commentToDelete;
    }
    throw new Error(COMMENT_NOT_FOUND);
  }
}
module.exports = new CommentsService();
