const changeCartItemSizeHandler = require('../../utils/changeCartItemSizeHandler');
const UserModel = require('../user/user.model');
const ProductModel = require('../product/product.model');
const ConstructorBasicModel = require('../constructor/constructor-basic/constructor-basic.model');
const ConstructorBottomModel = require('../constructor/constructor-bottom/constructor-bottom.model');
const ConstructorFrontPocketModel = require('../constructor/constructor-front-pocket/constructor-front-pocket.model');
const PatternModel = require('../pattern/pattern.model');
const RuleError = require('../../errors/rule.error');
const {
  CART_MESSAGES: {
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
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');
const { getSizeById } = require('../size/size.service');
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
      { $unset: { cart: 1 } },
    ).exec();
  }

  async getCartByUserId(id) {
    const cartByUserId = await UserModel.findOne({ _id: id }, 'cart ').exec();

    if (!cartByUserId.cart) {
      throw new RuleError(CART_IS_NOT_FOUND, NOT_FOUND);
    }

    const cartSum = await getTotalCartSum(cartByUserId.cart.items, id);

    return UserModel.findByIdAndUpdate(
      id,
      { $set: { 'cart.totalPrice': cartSum } },
      { new: true },
    ).exec();
  }

  async changeCartItemSize(id, itemId, size, price, quantity) {
    const userWithCart = await UserModel.findOne({ _id: id }, 'cart ').exec();

    const cart = userWithCart?.cart;

    if (!cart) {
      throw new RuleError(CART_IS_NOT_FOUND, NOT_FOUND);
    }

    const newCart = changeCartItemSizeHandler(
      itemId,
      size,
      price,
      quantity,
      cart.items,
    );

    const cartSum = await getTotalCartSum(newCart, id);

    return UserModel.findByIdAndUpdate(
      id,
      { $set: { 'cart.items': newCart, 'cart.totalPrice': cartSum } },
      { new: true },
    ).exec();
  }

  async addProductToCart(allSizes, sizeId, id, { _id }, price) {
    const isProductAlreadyExistsInCart = await UserModel.findOne(
      {
        _id: id,
        'cart.items': { $elemMatch: { product: _id, 'options.size': sizeId } },
      },
      'cart.items.$',
    ).exec();

    const productPriceWithSize = calculateCartItemPriceWithSize(price);

    const { cart } = await UserModel.findById(id, 'cart -_id').exec();

    if (cart?.items?.length) {
      const totalPrice = totalCartSum(
        ADD_ITEM,
        productPriceWithSize,
        cart.totalPrice,
      );

      if (isProductAlreadyExistsInCart) {
        const incrementProductPrice = totalCartSum(
          ADD_ITEM,
          productPriceWithSize,
          isProductAlreadyExistsInCart.cart.items[0].price,
        );
        return UserModel.findOneAndUpdate(
          {
            _id: id,
            'cart.items._id': isProductAlreadyExistsInCart.cart.items[0]._id,
          },
          {
            $set: {
              'cart.totalPrice': totalPrice,
              'cart.items.$.price': incrementProductPrice,
              'cart.items.$.quantity':
                isProductAlreadyExistsInCart.cart.items[0].quantity + 1,
            },
            'cart.items.$.allSizes': allSizes,
          },
          {
            new: true,
            safe: true,
            upsert: true,
          },
        ).exec();
      }
      return UserModel.findOneAndUpdate(
        { _id: id },
        {
          'cart.totalPrice': totalPrice,
          $push: {
            'cart.items': {
              product: _id,
              'options.size': sizeId,
              allSizes,
              price: productPriceWithSize,
            },
          },
        },
        {
          new: true,
          safe: true,
          upsert: true,
        },
      ).exec();
    }
    return UserModel.findOneAndUpdate(
      { _id: id },
      {
        'cart.totalPrice': productPriceWithSize,
        $push: {
          'cart.items': {
            product: _id,
            'options.size': sizeId,
            allSizes,
            price: productPriceWithSize,
          },
        },
      },
      {
        new: true,
        safe: true,
        upsert: true,
      },
    ).exec();
  }

  async addConstructorProductItemToCart(
    {
      constructorBasics,
      constructorBottom,
      constructorPattern,
      constructorFrontPocket,
    },
    sizeId,
    id,
    { _id },
  ) {
    const isItemAlreadyExists = await UserModel.findOne(
      {
        _id: id,
        'cart.items': {
          $elemMatch: {
            'fromConstructor.product': _id,
            'fromConstructor.constructorBasics': constructorBasics,
            'fromConstructor.constructorBottom': constructorBottom,
            'fromConstructor.constructorPattern': constructorPattern,
            'fromConstructor.constructorFrontPocket': constructorFrontPocket,
            'options.size': sizeId,
          },
        },
      },
      'cart.items.$',
    ).exec();

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
      constructorFrontPocket,
    ).exec();

    if (!constructorFrontPocketPrice) {
      throw new RuleError(FRONT_POCKET_NOT_FOUND, NOT_FOUND);
    }

    const isPatternPresent = await PatternModel.findById(
      constructorPattern,
    ).exec();

    if (!isPatternPresent) throw new RuleError(PATTERN_NOT_FOUND, NOT_FOUND);

    const { cart } = await UserModel.findById(id, 'cart -_id').exec();

    const productPriceWithSize = calculateConstructorCartItemPriceWithSize(
      sizePrice,
      constructorBasicsPrice,
      constructorBottomPrice,
      constructorFrontPocketPrice,
    );

    if (cart?.items?.length) {
      const totalPrice = totalCartSum(
        ADD_ITEM,
        productPriceWithSize,
        cart.totalPrice,
      );
      if (isItemAlreadyExists) {
        const incrementProductPrice = totalCartSum(
          ADD_ITEM,
          productPriceWithSize,
          isItemAlreadyExists.cart.items[0].price,
        );
        return UserModel.findOneAndUpdate(
          {
            _id: id,
            'cart.items._id': isItemAlreadyExists.cart.items[0]._id,
          },
          {
            $set: {
              'cart.totalPrice': totalPrice,
              'cart.items.$.price': incrementProductPrice,
              'cart.items.$.quantity':
                isItemAlreadyExists.cart.items[0].quantity + 1,
            },
          },
          {
            new: true,
          },
        ).exec();
      }
      return UserModel.findOneAndUpdate(
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
        },
      ).exec();
    }
    return UserModel.findOneAndUpdate(
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
      },
    ).exec();
  }

  async updateCartItemQuantity(quantity, sizeId, id, { _id }) {
    const { cart } = await UserModel.findById(id, 'cart -_id').exec();

    if (!cart) throw new RuleError(CART_IS_NOT_FOUND, NOT_FOUND);

    const itemFromCart = await UserModel.findOne(
      {
        _id: id,
        'cart.items': { $elemMatch: { product: _id, 'options.size': sizeId } },
      },
      'cart.items.$',
    ).exec();

    if (!itemFromCart) {
      throw new RuleError(PRODUCT_IS_NOT_EXIST_IN_CART, BAD_REQUEST);
    }

    const priceForProduct = itemFromCart.cart.items[0].price;

    if (cart.items?.length > 1) {
      const oldTotalSum = totalCartSum(
        REMOVE_ITEM,
        itemFromCart.cart.items[0].price,
        cart.totalPrice,
      );
      const newTotalSum = totalCartSum(ADD_ITEM, priceForProduct, oldTotalSum);

      return UserModel.findOneAndUpdate(
        {
          _id: id,
          'cart.items._id': itemFromCart.cart.items[0]._id,
        },
        {
          $set: {
            'cart.totalPrice': newTotalSum,
            'cart.items.$.price': priceForProduct,
            'cart.items.$.quantity': quantity,
          },
        },
        { new: true },
      ).exec();
    }
    return UserModel.findOneAndUpdate(
      {
        _id: id,
        'cart.items._id': itemFromCart.cart.items[0]._id,
      },
      {
        $set: {
          'cart.totalPrice': priceForProduct,
          'cart.items.$.price': priceForProduct,
          'cart.items.$.quantity': quantity,
        },
      },
      { new: true },
    ).exec();
  }

  async updateCartConstructorProductItemQuantity(
    quantity,
    constructorData,
    id,
  ) {
    if (!constructorData) {
      throw new RuleError(PRODUCT_IS_NOT_EXIST_IN_CART, BAD_REQUEST);
    }

    const { cart } = await UserModel.findById(id, 'cart -_id').exec();

    const newPriceForConstructorProduct = constructorData.cart.items[0].price.map(
      ({ value, currency }) => ({
        value: (value / constructorData.cart.items[0].quantity) * quantity,
        currency,
      }),
    );

    if (cart.items?.length > 1) {
      const oldTotalSum = totalCartSum(
        REMOVE_ITEM,
        constructorData.cart.items[0].price,
        cart.totalPrice,
      );
      const newTotalSum = totalCartSum(
        ADD_ITEM,
        newPriceForConstructorProduct,
        oldTotalSum,
      );

      return UserModel.findOneAndUpdate(
        {
          _id: id,
          'cart.items._id': constructorData.cart.items[0]._id,
        },
        {
          $set: {
            'cart.totalPrice': newTotalSum,
            'cart.items.$.price': newPriceForConstructorProduct,
            'cart.items.$.quantity': quantity,
          },
        },
        { new: true },
      ).exec();
    }
    return UserModel.findOneAndUpdate(
      {
        _id: id,
        'cart.items._id': constructorData.cart.items[0]._id,
      },
      {
        $set: {
          'cart.totalPrice': newPriceForConstructorProduct,
          'cart.items.$.price': newPriceForConstructorProduct,
          'cart.items.$.quantity': quantity,
        },
      },
      { new: true },
    ).exec();
  }

  async mergeCartFromLS(cartFromLS, id) {
    await Promise.all(
      cartFromLS.map(async (item) => {
        if (item.product) {
          const isProductPresent = await ProductModel.findById(
            item.product,
          ).exec();
          const isProductAlreadyInCart = await UserModel.findOne(
            {
              _id: id,
              'cart.items': {
                $elemMatch: {
                  product: item.product,
                  'options.size': item.options.size,
                },
              },
            },
            'cart.items.$',
          ).exec();
          if (item.price && !isProductAlreadyInCart && isProductPresent) {
            await UserModel.findOneAndUpdate(
              { _id: id },
              {
                $push: {
                  'cart.items': {
                    product: item.product,
                    quantity: item.quantity,
                    'options.size': item.options.size,
                    allSizes: item.allSizes,
                    price: item.price,
                  },
                },
              },
            ).exec();
          }
        }
        if (item.productFromConstructor) {
          const isProductPresent = await ProductModel.findById(
            item.productFromConstructor.product,
          ).exec();

          const isConstructorAlreadyInCart = await UserModel.findOne(
            {
              _id: id,
              'cart.items': {
                $elemMatch: {
                  'fromConstructor.product':
                    item.productFromConstructor.product,
                  'fromConstructor.constructorBasics':
                    item.productFromConstructor.constructorBasics,
                  'fromConstructor.constructorBottom':
                    item.productFromConstructor.constructorBottom,
                  'fromConstructor.constructorPattern':
                    item.productFromConstructor.constructorPattern,
                  'fromConstructor.constructorFrontPocket':
                    item.productFromConstructor.constructorFrontPocket,
                  'options.size': item.options.size,
                },
              },
            },
            'cart.items.$',
          ).exec();

          const {
            basePrice: constructorBasicsPrice,
          } = await ConstructorBasicModel.findById(
            item.productFromConstructor.constructorBasics,
          ).exec();

          const {
            basePrice: constructorBottomPrice,
          } = await ConstructorBottomModel.findById(
            item.productFromConstructor.constructorBottom,
          ).exec();

          const {
            basePrice: constructorFrontPocketPrice,
          } = await ConstructorFrontPocketModel.findById(
            item.productFromConstructor.constructorFrontPocket,
          ).exec();

          const isPatternPresent = await PatternModel.findById(
            item.productFromConstructor.constructorPattern,
          ).exec();

          if (
            isProductPresent
            && !isConstructorAlreadyInCart
            && constructorBasicsPrice
            && constructorBottomPrice
            && constructorFrontPocketPrice
            && isPatternPresent
          ) {
            const itemPrice = calculateConstructorCartItemPriceWithSize(
              item.price,
              constructorBasicsPrice,
              constructorBottomPrice,
              constructorFrontPocketPrice,
              item.quantity,
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
              },
            ).exec();
          }
        }
      }),
    );

    const { cart } = await UserModel.findById(id, 'cart ').exec();

    const totalPrice = await setTotalCartSum(cart.items);

    return UserModel.findByIdAndUpdate(
      id,
      { $set: { 'cart.totalPrice': totalPrice } },
      { new: true },
    ).exec();
  }

  async removeProductItemsFromCart(item, id) {
    if (item?.product) {
      const isProductExistsInCart = await UserModel.findOne(
        {
          _id: id,
          'cart.items': {
            $elemMatch: {
              product: item.product,
              'options.size': item.options.size,
            },
          },
        },
        'cart.items.$',
      ).exec();

      if (isProductExistsInCart) {
        await UserModel.findOneAndUpdate(
          {
            _id: id,
            'cart.items._id': isProductExistsInCart.cart.items[0]._id,
          },
          {
            $pull: {
              'cart.items': {
                _id: isProductExistsInCart.cart.items[0]._id,
              },
            },
          },
        ).exec();
      }
    }
    if (item?.productFromConstructor) {
      const isConstructorExistsInCart = await UserModel.findOne(
        {
          _id: id,
          'cart.items': {
            $elemMatch: {
              'fromConstructor.product': item.productFromConstructor.product,
              'fromConstructor.constructorBasics':
                item.productFromConstructor.constructorBasics,
              'fromConstructor.constructorBottom':
                item.productFromConstructor.constructorBottom,
              'fromConstructor.constructorPattern':
                item.productFromConstructor.constructorPattern,
              'fromConstructor.constructorFrontPocket':
                item.productFromConstructor.constructorFrontPocket,
              'options.size': item.options.size,
            },
          },
        },
        'cart.items.$',
      ).exec();

      if (isConstructorExistsInCart) {
        await UserModel.findOneAndUpdate(
          {
            _id: id,
            'cart.items._id': isConstructorExistsInCart.cart.items[0]._id,
          },
          {
            $pull: {
              'cart.items': {
                _id: isConstructorExistsInCart.cart.items[0]._id,
              },
            },
          },
        ).exec();
      }
    }

    const { cart } = await UserModel.findById(id, 'cart ').exec();

    const totalPrice = await setTotalCartSum(cart?.items);

    return UserModel.findByIdAndUpdate(
      id,
      { $set: { 'cart.totalPrice': totalPrice } },
      { new: true },
    ).exec();
  }
}

module.exports = new CartService();
