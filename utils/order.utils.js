const productModel = require('../modules/product/product.model');
const {
  ORDER_STATUSES: { CANCELLED, REFUNDED },
} = require('../consts/order-statuses');

async function calculateTotalItemsPrice(items) {
  return items.reduce(async (prev, item) => {
    const sum = await prev;

    const product = await productModel.findById(item.product).exec();

    const { price } = product.sizes.find(
      sz => sz.size._id.toString() === item.options.size
    );

    item.fixedPrice = price;

    return price * item.quantity + sum;
  }, 0);
}

function calculateTotalPriceToPay(data, totalItemsPrice) {
  return totalItemsPrice;
}

function generateOrderNumber() {
  const uid = new Date().getTime();

  return uid.toString();
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
      if (index === -1) {
        quantity = newItem.quantity;
      } else {
        quantity = newItem.quantity + oldItems[index].quantity;
        oldItems.splice(index, 1);
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
