const Comments = require('./comment.model');
const Product = require('../product/product.model');
const { PRODUCT_NOT_FOUND } = require('../../error-messages/products.messages');

class CommentsService {
  getCommentById(id) {
    return Comments.findById(id);
  }

  async getAllCommentsByProduct(id) {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error(PRODUCT_NOT_FOUND);
    }
    return Comments.find({ product: id });
  }

  updateComment(id, comments) {
    return Comments.findByIdAndUpdate(id, comments, { new: true });
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
