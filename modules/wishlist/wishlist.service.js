const Wishlist = require('./wishlist.model');
const RuleError = require('../../errors/rule.error');
const {
  WISHLIST_NOT_FOUND,
} = require('../../error-messages/wishlist.messages');
const {
  STATUS_CODES: { NOT_FOUND },
} = require('../../consts/status-codes');

class WishlistService {
  async getWishlistByUserId({ _id }) {
    const [wishlist] = await Wishlist.find({ user_id: _id }).exec();

    if (!wishlist) {
      throw new RuleError(WISHLIST_NOT_FOUND, NOT_FOUND);
    }

    return wishlist;
  }

  async addProductToWishlist(productId, { _id }) {
    const [wishlist] = await Wishlist.find({ user_id: _id }).exec();

    if (!wishlist)
      return new Wishlist({ user_id: _id, products: [productId] }).save();

    if (
      wishlist.products.find(
        product => JSON.stringify(product) === JSON.stringify(productId)
      )
    )
      wishlist.products = wishlist.products.filter(
        el => JSON.stringify(el._id) !== JSON.stringify(productId)
      );
    else wishlist.products.push(productId);

    return Wishlist.findByIdAndUpdate(wishlist._id, wishlist, {
      new: true,
    }).exec();
  }

  async deleteProductFromWishlist(productId, { _id }) {
    const [wishlist] = await Wishlist.find({ user_id: _id }).exec();

    if (!wishlist) {
      throw new RuleError(WISHLIST_NOT_FOUND, NOT_FOUND);
    }

    wishlist.products = wishlist.products.filter(
      product => JSON.stringify(product) !== JSON.stringify(productId)
    );

    return Wishlist.findByIdAndUpdate(wishlist._id, wishlist, {
      new: true,
    }).exec();
  }
}

module.exports = new WishlistService();
