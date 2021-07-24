const UserModel = require('../user/user.model');
const SizeModel = require('../size/size.model');
const ProductModel = require('../product/product.model');
const ConstructorBasicModel = require('../constructor/constructor-basic/constructor-basic.model');
const ConstructorBottomModel = require('../constructor/constructor-bottom/constructor-bottom.model');
const ConstructorFrontPocketModel = require('../constructor/constructor-front-pocket/constructor-front-pocket.model');
const PatternModel = require('../pattern/pattern.model');
const RuleError = require('../../errors/rule.error');
const {
  WISHLIST_MESSAGES: {
    PRODUCT_ALREADY_EXIST_IN_WISHLIST,
    WISHLIST_IS_ALREADY_CLEANED,
    WISHLIST_IS_NOT_FOUND,
  },
} = require('../../error-messages/wishlist.messages');
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
  totalSum,
  setTotalSum,
  getTotalSum,
} = require('../../helpers/calculateTotalSum');
const {
  calculateItemPriceWithSize,
  calculateConstructorItemPriceWithSize,
} = require('../../helpers/calculateItemPrice');
const {
  TOTAL_SUM_METHOD: { ADD_ITEM },
} = require('../../consts/total-sum-method');
const {
  DB_COLLECTIONS_NAMES: { WISHLIST },
} = require('../../consts/db-collections-names');

class WishlistService {
  async cleanWishlist(id) {
    const { wishlist } = await UserModel.findOne(
      { _id: id },
      'wishlist -_id'
    ).exec();

    if (!wishlist)
      throw new RuleError(WISHLIST_IS_ALREADY_CLEANED, BAD_REQUEST);

    return UserModel.findOneAndUpdate(
      { _id: id },
      { $unset: { wishlist: 1 } }
    ).exec();
  }

  async getWishlistByUserId(id) {
    const wishlistByUserId = await UserModel.findOne(
      { _id: id },
      'wishlist '
    ).exec();

    if (!wishlistByUserId.wishlist) {
      throw new RuleError(WISHLIST_IS_NOT_FOUND, NOT_FOUND);
    }

    const wishlistSum = await getTotalSum(
      wishlistByUserId.wishlist.items,
      id,
      WISHLIST
    );

    return UserModel.findByIdAndUpdate(
      id,
      { $set: { 'wishlist.totalPrice': wishlistSum } },
      { new: true }
    ).exec();
  }

  async addProductItemToWishlist(sizeId, id, { _id }) {
    const isProductAlreadyExistsInWishlist = await UserModel.findOne(
      {
        _id: id,
        'wishlist.items': {
          $elemMatch: { product: _id, 'options.size': sizeId },
        },
      },
      'wishlist.items.$'
    ).exec();

    if (isProductAlreadyExistsInWishlist) {
      throw new RuleError(PRODUCT_ALREADY_EXIST_IN_WISHLIST, BAD_REQUEST);
    }

    const { additionalPrice: sizePrice } = await getSizeById(sizeId);

    if (!sizePrice) {
      throw new RuleError(SIZE_NOT_FOUND, NOT_FOUND);
    }

    const productPriceWithSize = calculateItemPriceWithSize(sizePrice);

    const { wishlist } = await UserModel.findById(id, 'wishlist -_id').exec();

    if (wishlist?.items?.length) {
      const totalPrice = totalSum(
        ADD_ITEM,
        productPriceWithSize,
        wishlist.totalPrice
      );
      return UserModel.findOneAndUpdate(
        { _id: id },
        {
          'wishlist.totalPrice': totalPrice,
          $push: {
            'wishlist.items': {
              product: _id,
              'options.size': sizeId,
              price: productPriceWithSize,
            },
          },
        },
        {
          new: true,
          safe: true,
          upsert: true,
        }
      ).exec();
    }
    return UserModel.findOneAndUpdate(
      { _id: id },
      {
        'wishlist.totalPrice': productPriceWithSize,
        $push: {
          'wishlist.items': {
            product: _id,
            'options.size': sizeId,
            price: productPriceWithSize,
          },
        },
      },
      {
        new: true,
        safe: true,
        upsert: true,
      }
    ).exec();
  }

  async addConstructorProductItemToWishlist(
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
    const isItemAlreadyExists = await UserModel.findOne(
      {
        _id: id,
        'wishlist.items': {
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
      'wishlist.items.$'
    ).exec();

    if (isItemAlreadyExists) {
      throw new RuleError(PRODUCT_ALREADY_EXIST_IN_WISHLIST, BAD_REQUEST);
    }

    const { additionalPrice: sizePrice } = await getSizeById(sizeId);

    if (!sizePrice) {
      throw new RuleError(SIZE_NOT_FOUND, NOT_FOUND);
    }

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

    const { wishlist } = await UserModel.findById(id, 'wishlist -_id').exec();

    const constructorProductPrice = calculateConstructorItemPriceWithSize(
      sizePrice,
      constructorBasicsPrice,
      constructorBottomPrice,
      constructorFrontPocketPrice
    );

    if (wishlist?.items?.length) {
      const totalPrice = totalSum(
        ADD_ITEM,
        constructorProductPrice,
        wishlist.totalPrice
      );

      return UserModel.findOneAndUpdate(
        { _id: id },
        {
          'wishlist.totalPrice': totalPrice,
          $push: {
            'wishlist.items': {
              'fromConstructor.product': _id,
              'fromConstructor.constructorBasics': constructorBasics,
              'fromConstructor.constructorBottom': constructorBottom,
              'fromConstructor.constructorFrontPocket': constructorFrontPocket,
              'fromConstructor.constructorPattern': constructorPattern,
              'options.size': sizeId,
              price: constructorProductPrice,
            },
          },
        },
        {
          new: true,
        }
      ).exec();
    }
    return UserModel.findOneAndUpdate(
      { _id: id },
      {
        'wishlist.totalPrice': constructorProductPrice,
        $push: {
          'wishlist.items': {
            'fromConstructor.product': _id,
            'fromConstructor.constructorBasics': constructorBasics,
            'fromConstructor.constructorBottom': constructorBottom,
            'fromConstructor.constructorFrontPocket': constructorFrontPocket,
            'fromConstructor.constructorPattern': constructorPattern,
            'options.size': sizeId,
            price: constructorProductPrice,
          },
        },
      },
      {
        new: true,
      }
    ).exec();
  }

  async mergeWishlistFromLS(wishlistFromLS, id) {
    await Promise.all(
      wishlistFromLS.map(async item => {
        const { additionalPrice: sizePrice } = await SizeModel.findById(
          item.options.size
        ).exec();

        if (item.product) {
          const isProductPresent = await ProductModel.findById(
            item.product
          ).exec();
          const isProductAlreadyInWishlist = await UserModel.findOne(
            {
              _id: id,
              'wishlist.items': {
                $elemMatch: {
                  product: item.product,
                  'options.size': item.options.size,
                },
              },
            },
            'wishlist.items.$'
          ).exec();

          if (sizePrice && !isProductAlreadyInWishlist && isProductPresent) {
            const itemPrice = calculateItemPriceWithSize(sizePrice);

            await UserModel.findOneAndUpdate(
              { _id: id },
              {
                $push: {
                  'wishlist.items': {
                    product: item.product,
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

          const isConstructorAlreadyInWishlist = await UserModel.findOne(
            {
              _id: id,
              'wishlist.items': {
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
            'wishlist.items.$'
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
            !isConstructorAlreadyInWishlist &&
            constructorBasicsPrice &&
            constructorBottomPrice &&
            constructorFrontPocketPrice &&
            isPatternPresent
          ) {
            const itemPrice = calculateConstructorItemPriceWithSize(
              sizePrice,
              constructorBasicsPrice,
              constructorBottomPrice,
              constructorFrontPocketPrice
            );

            await UserModel.findOneAndUpdate(
              { _id: id },
              {
                $push: {
                  'wishlist.items': {
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

    const { wishlist } = await UserModel.findById(id, 'wishlist ').exec();

    const totalPrice = await setTotalSum(wishlist.items);

    return UserModel.findByIdAndUpdate(
      id,
      { $set: { 'wishlist.totalPrice': totalPrice } },
      { new: true }
    ).exec();
  }

  async removeProductItemsFromWishlist(item, id) {
    if (item?.product) {
      const isProductExistsInWishlist = await UserModel.findOne(
        {
          _id: id,
          'wishlist.items': {
            $elemMatch: {
              product: item.product,
              'options.size': item.options.size,
            },
          },
        },
        'wishlist.items.$'
      ).exec();

      if (isProductExistsInWishlist) {
        await UserModel.findOneAndUpdate(
          {
            _id: id,
            'wishlist.items._id':
              isProductExistsInWishlist.wishlist.items[0]._id,
          },
          {
            $pull: {
              'wishlist.items': {
                _id: isProductExistsInWishlist.wishlist.items[0]._id,
              },
            },
          }
        ).exec();
      }
    }
    if (item?.productFromConstructor) {
      const isConstructorExistsInWishlist = await UserModel.findOne(
        {
          _id: id,
          'wishlist.items': {
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
        'wishlist.items.$'
      ).exec();

      if (isConstructorExistsInWishlist) {
        await UserModel.findOneAndUpdate(
          {
            _id: id,
            'wishlist.items._id':
              isConstructorExistsInWishlist.wishlist.items[0]._id,
          },
          {
            $pull: {
              'wishlist.items': {
                _id: isConstructorExistsInWishlist.wishlist.items[0]._id,
              },
            },
          }
        ).exec();
      }
    }

    const { wishlist } = await UserModel.findById(id, 'wishlist ').exec();

    const totalPrice = await setTotalSum(wishlist?.items);

    return UserModel.findByIdAndUpdate(
      id,
      { $set: { 'wishlist.totalPrice': totalPrice } },
      { new: true }
    ).exec();
  }

  async getAllUsersEmailsByWishlistProduct(productId) {
    return UserModel.find(
      { 'wishlist.items.product': productId },
      'wishlist email firstName'
    )
      .populate({
        path: 'wishlist.items.product',
        select: 'name images ',
      })
      .populate({
        path: 'wishlist.items.fromConstructor.product',
        select: 'name images ',
      })
      .populate({
        path: 'wishlist.items.options.size ',
        select: 'name',
      })
      .exec();
  }
}

module.exports = new WishlistService();
