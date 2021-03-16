const UserModel = require('../user/user.model');
const ConstructorBasicModel = require('../constructor/constructor-basic/constructor-basic.model');
const ConstructorBottomModel = require('../constructor/constructor-bottom/constructor-bottom.model');
const ConstructorFrontPocketModel = require('../constructor/constructor-front-pocket/constructor-front-pocket.model');
const PatternModel = require('../../modules/pattern/pattern.model');
const RuleError = require('../../errors/rule.error');
const {
  CART_MESSAGES: {
    PRODUCT_ALREADY_EXIST_IN_CART,
    PRODUCT_IS_NOT_EXIST_IN_CART,
    CART_IS_ALREADY_CLEANED,
    CART_IS_NOT_FOUND,
  },
} = require('../../error-messages/cart.messages');
const { SIZE_NOT_FOUND } = require('../../error-messages/size.messages');
const {
  BASIC_NOT_FOUND,
} = require('../../error-messages/constructor-basic-messages');
const {
  CONSTRUCTOR_BOTTOM_NOT_FOUND,
} = require('../../error-messages/constructor-bottom.messages');
const {
  FRONT_POCKET_NOT_FOUND,
} = require('../../error-messages/constructor-front-pocket-messages');
const { PATTERN_NOT_FOUND } = require('../../error-messages/pattern.messages');
const {
  STATUS_CODES: { FORBIDDEN, NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');
const { getSizeById } = require('../../modules/size/size.service');
const {
  calculateCartItemPriceWithSize,
} = require('../../helpers/calculateCartItemPrice');
const { totalCartSum } = require('../../helpers/calculateCartTotalSum');
const {
  CART_TOTAL_SUM_METHOD: { ADD_ITEM, REMOVE_ITEM },
} = require('../../consts/cart-total-sum-method');

class CartService {
  async getCartByUserId(id) {
    const cartByUserId = await UserModel.findOne({ _id: id }, 'cart ');

    if (!cartByUserId.cart) {
      throw new RuleError(CART_IS_NOT_FOUND, NOT_FOUND);
    }

    return cartByUserId;
  }

  async addProductToCart(sizeId, id, { _id }) {
    const isProductAlreadyExistsInCart = await UserModel.findOne({
      _id: id,
      'cart.items.product': _id,
      'cart.items.options.size': sizeId,
    }).exec();

    if (isProductAlreadyExistsInCart) {
      throw new RuleError(PRODUCT_ALREADY_EXIST_IN_CART, FORBIDDEN);
    }
    const { additionalPrice } = await getSizeById(sizeId);

    if (!additionalPrice) throw new RuleError(SIZE_NOT_FOUND, NOT_FOUND);
    const productPriceWithSize = calculateCartItemPriceWithSize(
      additionalPrice
    );

    const { cart } = await UserModel.findById(id, 'cart -_id');

    if (cart?.items?.length) {
      const totalPrice = totalCartSum(
        ADD_ITEM,
        productPriceWithSize,
        cart.totalPrice
      );

      return UserModel.updateOne(
        { _id: id },
        {
          'cart.totalPrice': totalPrice,
          $push: {
            'cart.items': {
              product: _id,
              'options.size': sizeId,
              price: productPriceWithSize,
            },
          },
        },
        {
          new: true,
        }
      ).exec();
    } else {
      return UserModel.updateOne(
        { _id: id },
        {
          'cart.totalPrice': productPriceWithSize,
          $push: {
            'cart.items': {
              product: _id,
              'options.size': sizeId,
              price: productPriceWithSize,
            },
          },
        },
        {
          new: true,
        }
      ).exec();
    }
  }

  async removeCartProductItem(id, { _id }) {
    const isProductPresentInCart = await UserModel.findOne({
      _id: id,
      'cart.items.product': _id,
    });

    if (!isProductPresentInCart) {
      throw new RuleError(PRODUCT_IS_NOT_EXIST_IN_CART, BAD_REQUEST);
    }

    const {
      cart: { items: deleteItem },
    } = await UserModel.findOneAndUpdate(
      { _id: id, 'cart.items.product': _id },
      { $pull: { 'cart.items': { product: _id } } },
      { projection: 'cart.items.$' }
    ).exec();

    const { cart: updatedCart } = await UserModel.findOne(
      { _id: id },
      'cart -_id'
    );

    if (updatedCart.items.length) {
      const cartSum = totalCartSum(
        REMOVE_ITEM,
        deleteItem[0].price,
        updatedCart.totalPrice
      );

      return UserModel.updateOne(
        { _id: id },
        { 'cart.totalPrice': cartSum },
        { new: true }
      ).exec();
    } else {
      return UserModel.updateOne(
        { _id: id },
        { $unset: { cart: 1 } },
        { new: true }
      ).exec();
    }
  }

  async cleanCart(id) {
    const { cart } = await UserModel.findOne({ _id: id }, 'cart -_id');

    if (!cart) throw new RuleError(CART_IS_ALREADY_CLEANED, BAD_REQUEST);

    return UserModel.findOneAndUpdate({ _id: id }, { $unset: { cart: 1 } });
  }

  async updateCartItemQuantity(quantity, id, { _id }) {
    const { cart } = await UserModel.findById(id, 'cart -_id');

    if (!cart) throw new RuleError(CART_IS_NOT_FOUND, NOT_FOUND);

    const itemFromCart = await UserModel.findOne(
      { _id: id, 'cart.items.product': _id },
      'cart.items.$ -_id'
    );

    if (!itemFromCart) {
      throw new RuleError(PRODUCT_IS_NOT_EXIST_IN_CART, BAD_REQUEST);
    }
    const newPriceForProduct = itemFromCart.cart.items[0].price.map(
      ({ value, currency }) => {
        return { value: value * quantity, currency };
      }
    );
    if (cart.items?.length > 1) {
      const oldTotalSum = totalCartSum(
        REMOVE_ITEM,
        itemFromCart.cart.items[0].price,
        cart.totalPrice
      );
      const newTotalSum = totalCartSum(
        ADD_ITEM,
        newPriceForProduct,
        oldTotalSum
      );

      return UserModel.findOneAndUpdate(
        { _id: id, 'cart.items.product': _id },
        {
          $set: {
            'cart.totalPrice': newTotalSum,
            'cart.items.$.price': newPriceForProduct,
          },
        },
        { new: true }
      );
    } else {
      return UserModel.findOneAndUpdate(
        { _id: id, 'cart.items.product': _id },
        {
          $set: {
            'cart.totalPrice': newPriceForProduct,
            'cart.items.$.price': newPriceForProduct,
          },
        },
        { new: true }
      );
    }
  }

  async addConstructorProductItem(
    {
      constructorBasics,
      constructorBottom,
      constructorPattern,
      constructorFrontPocket,
    },
    sizeId,
    id,
    { _id }
  ) {
    const isItemAlreadyExists = UserModel.findOne({
      _id: id,
      'cart.items.product': _id,
      'cart.items.fromConstructor.constructorBasics': constructorBasics,
      'cart.items.fromConstructor.constructorBottom': constructorBottom,
      'cart.items.fromConstructor.constructorPattern': constructorPattern,
      'cart.items.fromConstructor.constructorFrontPocket': constructorFrontPocket,
    });

    if (isItemAlreadyExists) {
      throw new RuleError(PRODUCT_ALREADY_EXIST_IN_CART, BAD_REQUEST);
    }
    const { additionalPrice } = await getSizeById(sizeId);

    if (!additionalPrice) throw new RuleError(SIZE_NOT_FOUND, NOT_FOUND);
    const {
      basePrice: constructorBasicsPrice,
    } = ConstructorBasicModel.findById(constructorBasics).exec();

    if (!constructorBasicsPrice) {
      throw new RuleError(BASIC_NOT_FOUND, NOT_FOUND);
    }
    const {
      basePrice: constructorBottomPrice,
    } = ConstructorBottomModel.findById(constructorBottom).exec();

    if (!constructorBottomPrice) {
      throw new RuleError(CONSTRUCTOR_BOTTOM_NOT_FOUND, NOT_FOUND);
    }
    const {
      basePrice: constructorFrontPocketPrice,
    } = ConstructorFrontPocketModel.findById(constructorFrontPocket).exec();

    if (!constructorFrontPocketPrice) {
      throw new RuleError(FRONT_POCKET_NOT_FOUND, NOT_FOUND);
    }
    const {} = await UserModel.return;
  }
}

module.exports = new CartService();
