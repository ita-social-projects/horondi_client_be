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

async function includesDiscountedProduct(promoCodeId, items) {
  if (promoCodeId) {
    const promoCode = await PromocodeModel.findById(promoCodeId).exec();
    const { discount, categories } = promoCode;

    return Promise.all(
      items.map(async item => {
        const product = await productModel.findById(item.product).exec();
        const category = await CategoryModel.findById(product.category).exec();
        const isAllowCategory = categories.find(
          name => name.toLowerCase() === category.code.toLowerCase()
        );
        if (isAllowCategory) {
          return discount;
        }

        return 0;
      })
    );
  }

  return Promise.all(items.map(() => 0));
}

async function calculateItemsPriceWithDiscount(promoCodeId, items) {
  if (promoCodeId) {
    const promoCode = await PromocodeModel.findById(promoCodeId).exec();
    const { discount, categories } = promoCode;

    return Promise.all(
      items.map(async item => {
        const product = await productModel.findById(item.product).exec();
        const category = await CategoryModel.findById(product.category).exec();
        const isAllowCategory = categories.find(
          name => name.toLowerCase() === category.code.toLowerCase()
        );
        if (isAllowCategory) {
          return (
            Math.round(item.fixedPrice - (item.fixedPrice / 100) * discount) *
            item.quantity
          );
        }

        return item.fixedPrice * item.quantity;
      })
    );
  }

  return items.map(item => item.fixedPrice * item.quantity);
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
  calculateItemsPriceWithDiscount,
  includesDiscountedProduct,
};
