const Product = require('../modules/product/product.model');
const ConstructorBasic = require('../modules/constructor/constructor-basic/constructor-basic.model');
const ConstructorFrontPocket = require('../modules/constructor/constructor-front-pocket/constructor-front-pocket.model');
const ConstructorBottom = require('../modules/constructor/constructor-bottom/constructor-bottom.model');
const Size = require('../modules/size/size.model');
const crypto = require('crypto');

async function calculateTotalItemsPrice(items) {
  return items.reduce(
    async (prev, item) => {
      const sum = await prev;
      const { quantity } = item;
      const { additionalPrice } = await Size.findById(item.options.size);

      if (!item.fixedPrice?.length) {
        if (item.isFromConstructor) {
          const constructorBasics = await ConstructorBasic.findById(
            item.constructorBasics
          );
          const constructorFrontPocket = await ConstructorFrontPocket.findById(
            item.constructorFrontPocket
          );
          const constructorBottom = await ConstructorBottom.findById(
            item.constructorBottom
          );
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
          const { basePrice } = await Product.findById(item.product);
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

// this method should return totalItemsPrice + nova poshta delivery price
function novaPoshtaDeliveryPrice(data) {
  // need backend for sizes
}

// this method should return totalItemsPrice + ukr poshta delivery price
function ukrPoshtaDeliveryPrice(data) {
  // need backend for sizes
}

function calculateTotalPriceToPay(data, totalItemsPrice) {
  switch (data.delivery.sentBy) {
    case 'NOVAPOST':
      return novaPoshtaDeliveryPrice();

    case 'UKRPOST':
      return ukrPoshtaDeliveryPrice();

    default:
      return totalItemsPrice;
  }
}

function generateOrderId() {
  return crypto.randomInt(100000000);
}

module.exports = {
  calculateTotalPriceToPay,
  generateOrderId,
  calculateTotalItemsPrice,
};
