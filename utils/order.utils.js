const { default: ShortUniqueId } = require('short-unique-id');

const ConstructorBasic = require('../modules/constructor/constructor-basic/constructor-basic.model');
const ConstructorFrontPocket = require('../modules/constructor/constructor-front-pocket/constructor-front-pocket.model');
const ConstructorBottom = require('../modules/constructor/constructor-bottom/constructor-bottom.model');
const Size = require('../modules/size/size.model');
const { CURRENCY, CURRENCY_VALUE } = require('./../consts/currency');

async function calculateTotalItemsPrice(items) {
  return items.reduce(
    async (prev, item) => {
      const sum = await prev;
      const { quantity } = item;
      const { additionalPrice } = await Size.findById(item.options.size).exec();

      if (!item.fixedPrice?.length) {
        if (item.isFromConstructor) {
          const constructorBasics = await ConstructorBasic.findById(
            item.constructorBasics
          ).exec();
          const constructorFrontPocket = await ConstructorFrontPocket.findById(
            item.constructorFrontPocket
          ).exec();
          const constructorBottom = await ConstructorBottom.findById(
            item.constructorBottom
          ).exec();
          item.fixedPrice = [
            {
              currency: CURRENCY.UAH,
              value:
                constructorBasics.basePrice[CURRENCY_VALUE.UAH_VALUE].value +
                constructorFrontPocket.basePrice[CURRENCY_VALUE.UAH_VALUE]
                  .value +
                constructorBottom.basePrice[CURRENCY_VALUE.UAH_VALUE].value +
                additionalPrice[CURRENCY_VALUE.UAH_VALUE].value,
            },
            {
              currency: CURRENCY.USD,
              value:
                constructorBasics.basePrice[CURRENCY_VALUE.USD_VALUE].value +
                constructorFrontPocket.basePrice[CURRENCY_VALUE.USD_VALUE]
                  .value +
                constructorBottom.basePrice[CURRENCY_VALUE.USD_VALUE].value +
                additionalPrice[CURRENCY_VALUE.USD_VALUE].value,
            },
          ];
        } else {
          item.fixedPrice = [
            {
              currency: CURRENCY.UAH,
              value: additionalPrice[CURRENCY_VALUE.UAH_VALUE].value,
            },
            {
              currency: CURRENCY.USD,
              value: additionalPrice[CURRENCY_VALUE.USD_VALUE].value,
            },
          ];
        }
      }
      return [
        {
          currency: CURRENCY.UAH,
          value:
            item.fixedPrice[CURRENCY_VALUE.UAH_VALUE].value * quantity +
            sum[CURRENCY_VALUE.UAH_VALUE].value,
        },
        {
          currency: CURRENCY.USD,
          value:
            item.fixedPrice[CURRENCY_VALUE.USD_VALUE].value * quantity +
            sum[CURRENCY_VALUE.USD_VALUE].value,
        },
      ];
    },
    [
      {
        currency: CURRENCY.UAH,
        value: 0,
      },
      {
        currency: CURRENCY.USD,
        value: 0,
      },
    ]
  );
}

function calculateTotalPriceToPay(data, totalItemsPrice) {
  return totalItemsPrice;
}

function generateOrderNumber() {
  const uid = new ShortUniqueId();

  return uid();
}

module.exports = {
  calculateTotalPriceToPay,
  generateOrderNumber,
  calculateTotalItemsPrice,
};
