const Product = require('../modules/product/product.model');
const ConstructorBasic = require('../modules/constructor/constructor-basic/constructor-basic.model');
const ConstructorFrontPocket = require('../modules/constructor/constructor-front-pocket/constructor-front-pocket.model');
const ConstructorBottom = require('../modules/constructor/constructor-bottom/constructor-bottom.model');
const Size = require('../modules/size/size.model');
const { default: ShortUniqueId } = require('short-unique-id');

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
              currency: 'UAH',
              value:
                constructorBasics.basePrice[0].value +
                constructorFrontPocket.basePrice[0].value +
                constructorBottom.basePrice[0].value +
                additionalPrice[0].value,
            },
            {
              currency: 'USD',
              value:
                constructorBasics.basePrice[1].value +
                constructorFrontPocket.basePrice[1].value +
                constructorBottom.basePrice[1].value +
                additionalPrice[1].value,
            },
          ];
        } else {
          const { basePrice } = await Product.findById(item.product).exec();
          item.fixedPrice = [
            {
              currency: 'UAH',
              value: basePrice[0].value + additionalPrice[0].value,
            },
            {
              currency: 'USD',
              value: basePrice[1].value + additionalPrice[1].value,
            },
          ];
        }
      }
      return [
        {
          currency: 'UAH',
          value: item.fixedPrice[0].value * quantity + sum[0].value,
        },
        {
          currency: 'USD',
          value: item.fixedPrice[1].value * quantity + sum[1].value,
        },
      ];
    },
    [
      {
        currency: 'UAH',
        value: 0,
      },
      {
        currency: 'USD',
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
