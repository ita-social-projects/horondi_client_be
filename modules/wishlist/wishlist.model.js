const { Schema, model } = require('mongoose');

const CurrencySet = require('../../models/CurrencySet').schema;
const {
  DB_COLLECTIONS_NAMES: {
    WISHLIST,
    PRODUCT,
    CONSTRUCTOR_BASICS,
    CONSTRUCTOR_BOTTOM,
    CONSTRUCTOR_FRONT_POCKET,
    PATTERN,
    SIZE,
  },
} = require('../../consts/db-collections-names');

const WishlistSchema = new Schema({
  _id: false,
  items: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: PRODUCT,
      },
      fromConstructor: {
        product: {
          type: Schema.Types.ObjectId,
          ref: PRODUCT,
        },
        constructorBasics: {
          type: Schema.Types.ObjectId,
          ref: CONSTRUCTOR_BASICS,
        },
        constructorBottom: {
          type: Schema.Types.ObjectId,
          ref: CONSTRUCTOR_BOTTOM,
        },
        constructorFrontPocket: {
          type: Schema.Types.ObjectId,
          ref: CONSTRUCTOR_FRONT_POCKET,
        },
        constructorPattern: {
          type: Schema.Types.ObjectId,
          ref: PATTERN,
        },
      },
      price: [CurrencySet],
      options: {
        size: {
          type: Schema.Types.ObjectId,
          ref: SIZE,
          required: true,
        },
      },
    },
  ],
  totalPrice: [CurrencySet],
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = model(WISHLIST, WishlistSchema);
