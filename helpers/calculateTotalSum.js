const {
  TOTAL_SUM_METHOD: { ADD_ITEM, REMOVE_ITEM },
} = require('../consts/total-sum-method');
const {
  CURRENCY_VALUE: { UAH_VALUE, USD_VALUE },
  CURRENCY: { USD, UAH },
} = require('../consts/currency');
const ConstructorBasicModel = require('../modules/constructor/constructor-basic/constructor-basic.model');
const ConstructorBottomModel = require('../modules/constructor/constructor-bottom/constructor-bottom.model');
const ConstructorFrontPocketModel = require('../modules/constructor/constructor-front-pocket/constructor-front-pocket.model');
const { getSizeById } = require('../modules/size/size.service');
const UserModel = require('../modules/user/user.model');
const {
  DB_COLLECTIONS_NAMES: { CART, WISHLIST },
} = require('../consts/db-collections-names');

const totalSum = (calculateMethod, newItemSum, cartSum) => {
  switch (calculateMethod) {
    case ADD_ITEM: {
      return Object.values(
        [...newItemSum, ...cartSum].reduce((acc, { currency, value }) => {
          acc[currency] = {
            currency,
            value: value + (acc[currency] ? acc[currency].value : 0),
          };
          return acc;
        }, {})
      );
    }
    case REMOVE_ITEM: {
      return Object.values(
        [...newItemSum, ...cartSum].reduce((acc, { currency, value }) => {
          acc[currency] = {
            currency,
            value: value - (acc[currency] ? acc[currency].value : 0),
          };
          return acc;
        }, {})
      );
    }
    default: {
      return cartSum;
    }
  }
};

const getTotalSum = (items, userId, target) =>
  items.reduce(
    async (acc, item) => {
      const sum = await acc;

      const { additionalPrice: sizePrice } = await getSizeById(
        item.options.size
      );

      if (item.product) {
        item.price = [
          {
            currency: UAH,
            value: sizePrice[UAH_VALUE].value * item.quantity,
          },
          {
            currency: USD,
            value: sizePrice[USD_VALUE].value * item.quantity,
          },
        ];
        if (target === CART) {
          await updateCartItemPrice(item, userId);
        } else if (target === WISHLIST) {
          await updateWishlistItemPrice(item, userId);
        }
      }
      if (item.fromConstructor.product) {
        const {
          basePrice: constructorBasicsPrice,
        } = await ConstructorBasicModel.findById(
          item.fromConstructor.constructorBasics
        ).exec();

        const {
          basePrice: constructorFrontPocketPrice,
        } = await ConstructorFrontPocketModel.findById(
          item.fromConstructor.constructorFrontPocket
        ).exec();

        const {
          basePrice: constructorBottomPrice,
        } = await ConstructorBottomModel.findById(
          item.fromConstructor.constructorBottom
        ).exec();

        item.price = [
          {
            currency: UAH,
            value:
              (sizePrice[UAH_VALUE].value +
                constructorBasicsPrice[UAH_VALUE].value +
                constructorBottomPrice[UAH_VALUE].value +
                constructorFrontPocketPrice[UAH_VALUE].value) *
              item.quantity,
          },
          {
            currency: USD,
            value:
              (sizePrice[USD_VALUE].value +
                constructorBasicsPrice[USD_VALUE].value +
                constructorBottomPrice[USD_VALUE].value +
                constructorFrontPocketPrice[USD_VALUE].value) *
              item.quantity,
          },
        ];
        if (target === CART) {
          await updateCartConstructorItemPrice(item, userId);
        } else if (target === WISHLIST) {
          await updateWishlistConstructorItemPrice(item, userId);
        }
      }

      return [
        {
          currency: UAH,
          value: item.price[UAH_VALUE].value + sum[UAH_VALUE].value,
        },
        {
          currency: USD,
          value: item.price[USD_VALUE].value + sum[USD_VALUE].value,
        },
      ];
    },
    [
      {
        currency: UAH,
        value: 0,
      },
      {
        currency: USD,
        value: 0,
      },
    ]
  );

const setTotalSum = items =>
  items.reduce(
    (acc, item) => [
      {
        currency: UAH,
        value: item.price[UAH_VALUE].value + acc[UAH_VALUE].value,
      },
      {
        currency: USD,
        value: item.price[USD_VALUE].value + acc[USD_VALUE].value,
      },
    ],
    [
      { currency: UAH, value: 0 },
      { currency: USD, value: 0 },
    ]
  );

const updateCartItemPrice = async (item, userId) => {
  await UserModel.findOneAndUpdate(
    {
      _id: userId,
      'cart.items.product': item.product,
      'cart.items.options.size': item.options.size,
    },
    {
      $set: {
        'cart.items.$.price': item.price,
      },
    }
  ).exec();
};

const updateWishlistItemPrice = async (item, userId) => {
  await UserModel.findOneAndUpdate(
    {
      _id: userId,
      'wishlist.items.product': item.product,
      'wishlist.items.options.size': item.options.size,
    },
    {
      $set: {
        'wishlist.items.$.price': item.price,
      },
    }
  ).exec();
};

const updateCartConstructorItemPrice = async (item, userId) => {
  await UserModel.findOneAndUpdate(
    {
      _id: userId,
      'cart.items.fromConstructor.product': item.fromConstructor.product,
      'cart.items.options.size': item.options.size,
    },
    {
      $set: {
        'cart.items.$.price': item.price,
      },
    }
  ).exec();
};

const updateWishlistConstructorItemPrice = async (item, userId) => {
  await UserModel.findOneAndUpdate(
    {
      _id: userId,
      'wishlist.items.fromConstructor.product': item.fromConstructor.product,
      'wishlist.items.options.size': item.options.size,
    },
    {
      $set: {
        'wishlist.items.$.price': item.price,
      },
    }
  ).exec();
};

module.exports = {
  totalSum,
  getTotalSum,
  setTotalSum,
};
