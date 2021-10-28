const mongoose = require('mongoose');
const {
  DB_COLLECTIONS_NAMES: { PRODUCT, WISHLIST, USER },
} = require('../../consts/db-collections-names');

const wishlistSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: USER,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: PRODUCT,
    },
  ],
});

module.exports = mongoose.model(WISHLIST, wishlistSchema);
