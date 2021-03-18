const UserModel = require('../user/user.model');
const SizeModel = require('../size/size.model');
const ProductModel = require('../product/product.model');
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
    CART_FOR_MERGING_IS_EMPTY,
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
  totalCartSum,
  setTotalCartSum,
  getTotalCartSum,
} = require('../../helpers/calculateCartTotalSum');
const {
  calculateCartItemPriceWithSize,
  calculateConstructorCartItemPriceWithSize,
} = require('../../helpers/calculateCartItemPrice');
const {
  CART_TOTAL_SUM_METHOD: { ADD_ITEM, REMOVE_ITEM },
} = require('../../consts/cart-total-sum-method');

class CartService {
  async cleanCart(id) {
    const { cart } = await UserModel.findOne({ _id: id }, 'cart -_id').exec();

    if (!cart) throw new RuleError(CART_IS_ALREADY_CLEANED, BAD_REQUEST);

    return UserModel.findOneAndUpdate(
      { _id: id },
      { $unset: { cart: 1 } }
    ).exec();
  }

  async getCartByUserId(id) {
    const cartByUserId = await UserModel.findOne({ _id: id }, 'cart ').exec();

    if (!cartByUserId.cart) {
      throw new RuleError(CART_IS_NOT_FOUND, NOT_FOUND);
    }

    const totalCartSum = await getTotalCartSum(cartByUserId.cart.items, id);

    return UserModel.findByIdAndUpdate(
      id,
      { $set: { 'cart.totalPrice': totalCartSum } },
      { new: true }
    ).exec();
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

    const { cart } = await UserModel.findById(id, 'cart -_id').exec();
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
    const isItemAlreadyExists = await UserModel.findOne({
      _id: id,
      'cart.items.options.size': sizeId,
      'cart.items.fromConstructor.product': _id,
      'cart.items.fromConstructor.constructorBasics': constructorBasics,
      'cart.items.fromConstructor.constructorBottom': constructorBottom,
      'cart.items.fromConstructor.constructorPattern': constructorPattern,
      'cart.items.fromConstructor.constructorFrontPocket': constructorFrontPocket,
    }).exec();

    if (isItemAlreadyExists) {
      throw new RuleError(PRODUCT_ALREADY_EXIST_IN_CART, BAD_REQUEST);
    }

    const { additionalPrice: sizePrice } = await getSizeById(sizeId);

    if (!sizePrice) throw new RuleError(SIZE_NOT_FOUND, NOT_FOUND);

    const {
      basePrice: constructorBasicsPrice,
    } = await ConstructorBasicModel.findById(constructorBasics).exec();

    if (!constructorBasicsPrice) {
      throw new RuleError(BASIC_NOT_FOUND, NOT_FOUND);
    }

    const {
      basePrice: constructorBottomPrice,
    } = await ConstructorBottomModel.findById(constructorBottom).exec();

    if (!constructorBottomPrice) {
      throw new RuleError(CONSTRUCTOR_BOTTOM_NOT_FOUND, NOT_FOUND);
    }

    const {
      basePrice: constructorFrontPocketPrice,
    } = await ConstructorFrontPocketModel.findById(
      constructorFrontPocket
    ).exec();

    if (!constructorFrontPocketPrice) {
      throw new RuleError(FRONT_POCKET_NOT_FOUND, NOT_FOUND);
    }

    const isPatternPresent = await PatternModel.findById(
      constructorPattern
    ).exec();

    if (!isPatternPresent) throw new RuleError(PATTERN_NOT_FOUND, NOT_FOUND);

    const { cart } = await UserModel.findById(id, 'cart -_id').exec();

    const productPriceWithSize = calculateConstructorCartItemPriceWithSize(
      sizePrice,
      constructorBasicsPrice,
      constructorBottomPrice,
      constructorFrontPocketPrice
    );

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
              'fromConstructor.product': _id,
              'fromConstructor.constructorBasics': constructorBasics,
              'fromConstructor.constructorBottom': constructorBottom,
              'fromConstructor.constructorFrontPocket': constructorFrontPocket,
              'fromConstructor.constructorPattern': constructorPattern,
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
              'fromConstructor.product': _id,
              'fromConstructor.constructorBasics': constructorBasics,
              'fromConstructor.constructorBottom': constructorBottom,
              'fromConstructor.constructorFrontPocket': constructorFrontPocket,
              'fromConstructor.constructorPattern': constructorPattern,
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

  async removeCartProductItem(sizeId, id, { _id }) {
    const isProductPresentInCart = await UserModel.findOne({
      _id: id,
      'cart.items.product': _id,
      'cart.items.options.size': sizeId,
    }).exec();

    if (!isProductPresentInCart) {
      throw new RuleError(PRODUCT_IS_NOT_EXIST_IN_CART, BAD_REQUEST);
    }

    const {
      cart: { items: deleteItem },
    } = await UserModel.findOneAndUpdate(
      { _id: id, 'cart.items.product': _id, 'cart.items.options.size': sizeId },
      { $pull: { 'cart.items': { product: _id } } },
      { projection: 'cart.items.$' }
    ).exec();

    const { cart: updatedCart } = await UserModel.findOne(
      { _id: id },
      'cart -_id'
    ).exec();

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

  async removeConstructorProductItemFromCart(
    productId,
    sizeId,
    constructorData,
    id
  ) {
    if (!constructorData) {
      throw new RuleError(PRODUCT_IS_NOT_EXIST_IN_CART, BAD_REQUEST);
    }

    const {
      cart: { items: deleteItem },
    } = await UserModel.findOneAndUpdate(
      {
        _id: id,
        'cart.items.fromConstructor.product': productId,
        'cart.items.options.size': sizeId,
      },
      { $pull: { 'cart.items': { 'fromConstructor.product': productId } } },
      { projection: 'cart.items.$' }
    ).exec();

    const { cart: updatedCart } = await UserModel.findOne(
      { _id: id },
      'cart -_id'
    ).exec();

    if (updatedCart?.items?.length) {
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

  async updateCartItemQuantity(quantity, sizeId, id, { _id }) {
    const { cart } = await UserModel.findById(id, 'cart -_id').exec();

    if (!cart) throw new RuleError(CART_IS_NOT_FOUND, NOT_FOUND);

    const itemFromCart = await UserModel.findOne(
      {
        _id: id,
        'cart.items.product': _id,
        'cart.items.options.size': sizeId,
      },
      'cart.items.$ -_id'
    ).exec();

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
        {
          _id: id,
          'cart.items.product': _id,
          'cart.items.options.size': sizeId,
        },
        {
          $set: {
            'cart.totalPrice': newTotalSum,
            'cart.items.$.price': newPriceForProduct,
            'cart.items.$.quantity': quantity,
          },
        },
        { new: true }
      ).exec();
    } else {
      return UserModel.findOneAndUpdate(
        {
          _id: id,
          'cart.items.product': _id,
          'cart.items.options.size': sizeId,
        },
        {
          $set: {
            'cart.totalPrice': newPriceForProduct,
            'cart.items.$.price': newPriceForProduct,
            'cart.items.$.quantity': quantity,
          },
        },
        { new: true }
      ).exec();
    }
  }

  async updateConstructorProductItemQuantity(
    quantity,
    productId,
    sizeId,
    constructorData,
    id
  ) {
    if (!constructorData) {
      throw new RuleError(PRODUCT_IS_NOT_EXIST_IN_CART, BAD_REQUEST);
    }

    const { cart } = await UserModel.findById(id, 'cart -_id').exec();

    const newPriceForConstructorProduct = constructorData.cart.items[0].price.map(
      ({ value, currency }) => {
        return { value: value * quantity, currency };
      }
    );

    if (cart.items?.length > 1) {
      const oldTotalSum = totalCartSum(
        REMOVE_ITEM,
        constructorData.cart.items[0].price,
        cart.totalPrice
      );
      const newTotalSum = totalCartSum(
        ADD_ITEM,
        newPriceForConstructorProduct,
        oldTotalSum
      );

      return UserModel.findOneAndUpdate(
        {
          _id: id,
          'cart.items.fromConstructor.product': productId,
          'cart.items.options.size': sizeId,
        },
        {
          $set: {
            'cart.totalPrice': newTotalSum,
            'cart.items.$.price': newPriceForConstructorProduct,
            'cart.items.$.quantity': quantity,
          },
        },
        { new: true }
      ).exec();
    } else {
      return UserModel.findOneAndUpdate(
        {
          _id: id,
          'cart.items.fromConstructor.product': productId,
          'cart.items.options.size': sizeId,
        },
        {
          $set: {
            'cart.totalPrice': newPriceForConstructorProduct,
            'cart.items.$.price': newPriceForConstructorProduct,
            'cart.items.$.quantity': quantity,
          },
        },
        { new: true }
      ).exec();
    }
  }

  async mergeCartFromLS(cartFromLS, id) {
    if (!cartFromLS.length)
      throw new RuleError(CART_FOR_MERGING_IS_EMPTY, BAD_REQUEST);

    await Promise.all(
      cartFromLS.map(async item => {
        const { additionalPrice: sizePrice } = await SizeModel.findById(
          item.options.size
        ).exec();

        if (item.product) {
          const isProductPresent = await ProductModel.findById(
            item.product
          ).exec();
          const isProductAlreadyInCart = await UserModel.findOne(
            {
              _id: id,
              'cart.items.product': item.product,
              'cart.items.options.size': item.options.size,
            },
            'cart.items.$ -_id'
          ).exec();

          if (sizePrice && !isProductAlreadyInCart && isProductPresent) {
            const itemPrice = calculateCartItemPriceWithSize(
              sizePrice,
              item.quantity
            );

            await UserModel.findOneAndUpdate(
              { _id: id },
              {
                $push: {
                  'cart.items': {
                    product: item.product,
                    quantity: item.quantity,
                    'options.size': item.options.size,
                    price: itemPrice,
                  },
                },
              }
            ).exec();
          }
        }
        if (item.productFromConstructor) {
          const isProductPresent = await ProductModel.findById(
            item.productFromConstructor.product
          ).exec();

          const isConstructorAlreadyInCart = await UserModel.findOne(
            {
              _id: id,
              'cart.items.fromConstructor.product':
                item.productFromConstructor.product,
              'cart.items.fromConstructor.constructorBasics':
                item.productFromConstructor.constructorBasics,
              'cart.items.fromConstructor.constructorBottom':
                item.productFromConstructor.constructorBottom,
              'cart.items.fromConstructor.constructorPattern':
                item.productFromConstructor.constructorPattern,
              'cart.items.fromConstructor.constructorFrontPocket':
                item.productFromConstructor.constructorFrontPocket,
              'cart.items.options.size': item.options.size,
            },
            'cart.items.$ -_id'
          ).exec();

          const {
            basePrice: constructorBasicsPrice,
          } = await ConstructorBasicModel.findById(
            item.productFromConstructor.constructorBasics
          ).exec();

          const {
            basePrice: constructorBottomPrice,
          } = await ConstructorBottomModel.findById(
            item.productFromConstructor.constructorBottom
          ).exec();

          const {
            basePrice: constructorFrontPocketPrice,
          } = await ConstructorFrontPocketModel.findById(
            item.productFromConstructor.constructorFrontPocket
          ).exec();

          const isPatternPresent = await PatternModel.findById(
            item.productFromConstructor.constructorPattern
          ).exec();

          if (
            isProductPresent &&
            !isConstructorAlreadyInCart &&
            constructorBasicsPrice &&
            constructorBottomPrice &&
            constructorFrontPocketPrice &&
            isPatternPresent
          ) {
            const itemPrice = calculateConstructorCartItemPriceWithSize(
              sizePrice,
              constructorBasicsPrice,
              constructorBottomPrice,
              constructorFrontPocketPrice,
              item.quantity
            );

            await UserModel.findOneAndUpdate(
              { _id: id },
              {
                $push: {
                  'cart.items': {
                    'fromConstructor.product':
                      item.productFromConstructor.product,
                    'fromConstructor.constructorBasics':
                      item.productFromConstructor.constructorBasics,
                    'fromConstructor.constructorBottom':
                      item.productFromConstructor.constructorBottom,
                    'fromConstructor.constructorFrontPocket':
                      item.productFromConstructor.constructorFrontPocket,
                    'fromConstructor.constructorPattern':
                      item.productFromConstructor.constructorPattern,
                    quantity: item.quantity,
                    'options.size': item.options.size,
                    price: itemPrice,
                  },
                },
              }
            ).exec();
          }
        }
      })
    );

    const { cart } = await UserModel.findById(id, 'cart ').exec();

    const totalPrice = await setTotalCartSum(cart?.items);

    return UserModel.findByIdAndUpdate(
      id,
      { $set: { 'cart.totalPrice': totalPrice } },
      { new: true }
    ).exec();
  }
}

module.exports = new CartService();
