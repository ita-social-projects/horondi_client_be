const { _ } = require('lodash');

const Product = require('../modules/product/product.model');
const Pattern = require('../modules/pattern/pattern.model');
const Closures = require('../modules/closures/closures.model');
const Material = require('../modules/material/material.model');
const Size = require('../modules/size/size.model');
const { calculateFinalPrice } = require('../modules/currency/currency.utils');
const {
  ADDITIONAL_PRICE_TYPES: { RELATIVE_INDICATOR, ABSOLUTE_INDICATOR },
} = require('../consts/additional-price-types');

const calculateHelper = (additionalPrices, sizePrices, basePrice) => {
  const relativePrices = _.reduce(
    additionalPrices,
    (sum, additionalPriceSet) => {
      let sumRelativePrice = sum;

      if (additionalPriceSet[0]?.type === RELATIVE_INDICATOR) {
        sumRelativePrice *= additionalPriceSet[0].value;
      }
      return sumRelativePrice;
    },
    basePrice
  );

  const pricesForSizes = _.map(sizePrices, (sizeAdditionalPrice) => {
    let tempPrice = relativePrices;
    if (sizeAdditionalPrice.additionalPrice[0]?.type === RELATIVE_INDICATOR) {
      tempPrice *= sizeAdditionalPrice.additionalPrice[0].value;
    }

    if (sizeAdditionalPrice.additionalPrice[0]?.type === ABSOLUTE_INDICATOR) {
      tempPrice += sizeAdditionalPrice.additionalPrice[1].value;
    }

    return { _id: sizeAdditionalPrice._id, price: tempPrice };
  });

  return Promise.all(
    _.map(pricesForSizes, async (priceForSize) => {
      let price = _.reduce(
        additionalPrices,
        (sum, additionalPriceSet) => {
          let sumAbsolutePrice = sum;
          if (additionalPriceSet[0]?.type === ABSOLUTE_INDICATOR) {
            sumAbsolutePrice += additionalPriceSet[1].value;
          }
          return sumAbsolutePrice;
        },
        priceForSize.price
      );

      price = await calculateFinalPrice(price);

      return { size: priceForSize._id, price };
    })
  ).then((result) => result);
};

const finalPriceCalculationForConstructor = async (product) => {
  const pattern = await Pattern.findById(product.pattern).exec();
  const mainMaterial = await Material.findById(
    product.mainMaterial.material
  ).exec();
  const bottomMaterial = await Material.findById(
    product.bottomMaterial.material
  ).exec();

  const prices = [
    pattern.additionalPrice,
    mainMaterial.additionalPrice,
    bottomMaterial.additionalPrice,
  ];

  const sizesPrice = await Size.find({
    _id: {
      $in: product.sizes,
    },
  }).exec();

  return calculateHelper(prices, sizesPrice, product.basePrice[1].value);
};

const finalPriceCalculation = async (product) => {
  const pattern = await Pattern.findById(product.pattern).exec();
  const closure = await Closures.findById(product.closure).exec();
  const mainMaterial = await Material.findById(
    product.mainMaterial.material
  ).exec();
  const innerMaterial = await Material.findById(
    product.innerMaterial.material
  ).exec();
  const bottomMaterial = await Material.findById(
    product.bottomMaterial.material
  ).exec();

  const prices = [
    pattern.additionalPrice,
    closure.additionalPrice,
    mainMaterial.additionalPrice,
    innerMaterial.additionalPrice,
    bottomMaterial.additionalPrice,
  ];

  const sizesPrice = await Size.find({
    _id: {
      $in: product.sizes,
    },
  }).exec();

  return calculateHelper(prices, sizesPrice, product.basePrice[1].value);
};

const finalPriceRecalculation = async (productId) => {
  let {
    pattern,
    closure,
    sizes,
    mainMaterial,
    innerMaterial,
    bottomMaterial,
  } = await Product.findById(productId)
    .populate('pattern')
    .populate('closure')
    .populate('sizes.size')
    .populate('mainMaterial.material')
    .populate('innerMaterial.material')
    .populate('bottomMaterial.material')
    .exec();

  const prices = [
    pattern.additionalPrice,
    closure.additionalPrice,
    mainMaterial.material.additionalPrice,
    innerMaterial.material.additionalPrice,
    bottomMaterial.material.additionalPrice,
  ];

  const { basePrice } = await Product.findById(productId).exec();

  sizes = sizes.map((size) => size.size);

  return calculateHelper(prices, sizes, basePrice[1].value);
};

module.exports = {
  finalPriceCalculation,
  finalPriceRecalculation,
  finalPriceCalculationForConstructor,
};
