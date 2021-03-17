const { Schema, model } = require('mongoose');

const CurrencySet = require('../../models/CurrencySet').schema;
const {
  DB_COLLECTIONS_NAMES: {
    CART,
    PRODUCT,
    CONSTRUCTOR_BASICS,
    CONSTRUCTOR_BOTTOM,
    CONSTRUCTOR_FRONT_POCKET,
    PATTERN,
    SIZE,
    MODEL,
  },
} = require('../../consts/db-collections-names');

const CartSchema = new Schema({
  _id: false,
  items: [
    {
      _id: false,
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
      quantity: {
        type: Number,
        required: true,
        default: 1,
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
  rememberMailCount: {
    type: Number,
    default: 0,
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = model(CART, CartSchema);
