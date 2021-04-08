const { default: ShortUniqueId } = require('short-unique-id');

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
  const uid = new ShortUniqueId();

  return uid();
}

async function addProductsToStatistic(items) {
  const ids = items.map(item => item.product);
  const products = await productModel.find({ _id: { $in: ids } });
  products.forEach(async product => {
    const { quantity } = items.find(item => {
      return item.product === product._id.toString();
    });
    product.purchasedCount += quantity;
    await product.save();
  });
}

async function updateProductStatistic(orderToUpdate, newOrder) {
  if (newOrder.status === CANCELLED || newOrder.status === REFUNDED) {
    const ids = orderToUpdate.items.map(item => item.product);
    const products = await productModel.find({ _id: { $in: ids } });
    products.forEach(async product => {
      const { quantity } = orderToUpdate.items.find(item => {
        return item.product.toString() === product._id.toString();
      });
      product.purchasedCount -= quantity;
      await product.save();
    });
  } else {
    const arrOfDifferences = newOrder.items.map(item => {
      const index = orderToUpdate.items.findIndex(
        el => el.product.toString() === item.product.toString()
      );
      let quantity;
      if (index !== -1) {
        quantity = item.quantity - orderToUpdate.items[index].quantity;
        orderToUpdate.items.splice(index, 1);
      } else {
        quantity = item.quantity;
      }
      return { _id: item.product, quantity };
    });
    arrOfDifferences.push(
      ...orderToUpdate.items.map(item => ({
        _id: item.product.toString(),
        quantity: -item.quantity,
      }))
    );
    const ids = arrOfDifferences.map(el => el._id);
    const products = await productModel.find({ _id: { $in: ids } });
    products.forEach(async product => {
      const { quantity } = arrOfDifferences.find(item => {
        return item._id === product._id.toString();
      });
      product.purchasedCount += quantity;
      await product.save();
    });
  }
}

module.exports = {
  calculateTotalPriceToPay,
  generateOrderNumber,
  calculateTotalItemsPrice,
  addProductsToStatistic,
  updateProductStatistic,
};
