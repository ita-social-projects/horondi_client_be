const ConstructorBasic = require('../modules/constructor/constructor-basic/constructor-basic.model');
const ConstructorFrontPocket = require('../modules/constructor/constructor-front-pocket/constructor-front-pocket.model');
const ConstructorBottom = require('../modules/constructor/constructor-bottom/constructor-bottom.model');
const Size = require('../modules/size/size.model');
const { CURRENCY, CURRENCY_VALUE } = require('./../consts/currency');
const productModel = require('../modules/product/product.model');
const {
  ORDER_STATUSES: { CANCELLED, REFUNDED },
} = require('../consts/order-statuses');

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
  return new Date().getTime();
}

async function addProductsToStatistic(items) {
  items.forEach(async item => {
    if (item.quantity !== 0) {
      const product = await productModel.findById(item.product).exec();
      product.purchasedCount += item.quantity;
      await product.save();
    }
  });
}

async function updateProductStatistic(orderToUpdate, newOrder) {
  if (
    (newOrder.status === CANCELLED || newOrder.status === REFUNDED) &&
    (orderToUpdate.status === CANCELLED || orderToUpdate.status === REFUNDED)
  ) {
    return;
  }
  const oldItems = orderToUpdate.items.map(item => ({
    product: item.product.toString(),
    quantity: -item.quantity,
  }));

  if (newOrder.status === CANCELLED || newOrder.status === REFUNDED) {
    await addProductsToStatistic(oldItems);
  } else if (
    newOrder.status !== CANCELLED &&
    newOrder.status !== REFUNDED &&
    (orderToUpdate.status === CANCELLED || orderToUpdate.status === REFUNDED)
  ) {
    await addProductsToStatistic(newOrder.items);
  } else {
    const newItems = newOrder.items.map(item => ({
      product: item.product,
      quantity: item.quantity,
    }));
    const items = newItems.map(newItem => {
      const index = oldItems.findIndex(el => el.product === newItem.product);
      let quantity;
      if (index !== -1) {
        quantity = newItem.quantity + oldItems[index].quantity;
        oldItems.splice(index, 1);
      } else {
        quantity = newItem.quantity;
      }
      return { product: newItem.product, quantity };
    });

    items.push(...oldItems);
    await addProductsToStatistic(items);
  }
}

module.exports = {
  calculateTotalPriceToPay,
  generateOrderNumber,
  calculateTotalItemsPrice,
  addProductsToStatistic,
  updateProductStatistic,
};
