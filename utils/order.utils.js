const productModel = require('../modules/product/product.model');
const CategoryModel = require('../modules/category/category.model');
const { PromocodeModel } = require('../modules/promo-code/promo-code.model');
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

async function calculateProductsPriceWithDiscount(promoCodeId, products) {
  if (promoCodeId) {
    const discounts = [];
    const priceWithDiscount = [];
    const promoCode = await PromocodeModel.findById(promoCodeId).exec();
    const { discount, categories } = promoCode;

    for (const item of products) {
      const product = await productModel.findById(item.product).exec();
      const category = await CategoryModel.findById(product.category).exec();
      const isAllowCategory = categories.find(
        name => name.toLowerCase() === category.code.toLowerCase()
      );
      if (isAllowCategory) {
        discounts.push(discount);
        priceWithDiscount.push(
          Math.round(item.fixedPrice - (item.fixedPrice / 100) * discount) *
            item.quantity
        );
      } else {
        discounts.push(0);
        priceWithDiscount.push(item.fixedPrice * item.quantity);
      }
    }

    return { discounts, priceWithDiscount };
  }

  return {
    discounts: products.map(() => 0),
    priceWithDiscount: products.map(item => item.fixedPrice * item.quantity),
  };
}

async function calculateTotalPriceToPay(itemsPriceWithDiscount) {
  return itemsPriceWithDiscount.reduce((prev, price) => prev + price, 0);
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
  calculateProductsPriceWithDiscount,
};
