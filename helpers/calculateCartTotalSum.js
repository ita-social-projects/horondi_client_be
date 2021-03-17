const {
  CART_TOTAL_SUM_METHOD: { ADD_ITEM },
} = require('../consts/cart-total-sum-method');
const {
  CURRENCY_VALUE: { UAH_VALUE, USD_VALUE },
  CURRENCY: { USD, UAH },
} = require('../consts/currency');
const ConstructorBasicModel = require('../modules/constructor/constructor-basic/constructor-basic.model');
const ConstructorBottomModel = require('../modules/constructor/constructor-bottom/constructor-bottom.model');
const ConstructorFrontPocketModel = require('../modules/constructor/constructor-front-pocket/constructor-front-pocket.model');
const { getSizeById } = require('../modules/size/size.service');
const UserModel = require('../modules/user/user.model');

const totalCartSum = (calculateMethod, newItemSum, cartSum) =>
  calculateMethod === ADD_ITEM
    ? Object.values(
        [...newItemSum, ...cartSum].reduce((acc, { currency, value }) => {
          acc[currency] = {
            currency,
            value: (acc[currency] ? acc[currency].value : 0) + value,
          };
          return acc;
        }, {})
      )
    : Object.values(
        [...newItemSum, ...cartSum].reduce((acc, { currency, value }) => {
          acc[currency] = {
            currency,
            value: value - (acc[currency] ? acc[currency].value : 0),
          };
          return acc;
        }, {})
      );

const getTotalCartSum = (items, userId) =>
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
            value: sizePrice[USD_VALUE].value + item.quantity,
          },
        ];
        await UserModel.findOneAndUpdate(
          {
            _id: userId,
            'cart.items.product': item.product,
          },
          {
            $set: {
              'cart.items.$.price': item.price,
            },
          }
        );
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
        await UserModel.findOneAndUpdate(
          {
            _id: userId,
            'cart.items.fromConstructor.product': item.fromConstructor.product,
          },
          {
            $set: {
              'cart.items.$.price': item.price,
            },
          }
        );
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

module.exports = {
  totalCartSum,
  getTotalCartSum,
};
