const { _ } = require('lodash');

const Product = require('../modules/product/product.model');
const Pattern = require('../modules/pattern/pattern.model');
const Closures = require('../modules/closures/closures.model');
const Material = require('../modules/material/material.model');
const Size = require('../modules/size/size.model');
const {
  ADDITIONAL_PRICE_TYPES: { RELATIVE_INDICATOR, ABSOLUTE_INDICATOR },
} = require('../consts/additional-price-types');

const calculateHelper = (additionalPrices, sizePrices, basePrice) => {
  const relativePrices = _.reduce(
    additionalPrices,
    (sum, additionalPriceSet) => {
      let sumRelativePrice = sum;

      if (additionalPriceSet?.type === RELATIVE_INDICATOR) {
        sumRelativePrice *= additionalPriceSet.value;
      }

      return sumRelativePrice;
    },
    basePrice
  );

  const pricesForSizes = _.map(sizePrices, sizeAdditionalPrice => {
    let tempPrice = relativePrices;
    if (sizeAdditionalPrice.additionalPrice?.type === RELATIVE_INDICATOR) {
      tempPrice *= sizeAdditionalPrice.additionalPrice.value;
    }

    if (sizeAdditionalPrice.additionalPrice?.type === ABSOLUTE_INDICATOR) {
      tempPrice += sizeAdditionalPrice.additionalPrice.value;
    }

    return { _id: sizeAdditionalPrice._id, price: tempPrice };
  });

  return Promise.all(
    _.map(pricesForSizes, async priceForSize => {
      const price = _.reduce(
        additionalPrices,
        (sum, additionalPriceSet) => {
          let sumAbsolutePrice = sum;
          if (additionalPriceSet?.type === ABSOLUTE_INDICATOR) {
            sumAbsolutePrice += additionalPriceSet.value;
          }

          return sumAbsolutePrice;
        },
        priceForSize.price
      );

      return { size: priceForSize._id, price };
    })
  ).then(result => result);
};

const finalPriceCalculationForConstructor = async product => {
  const pattern = await Pattern.findById(product.pattern).exec();
  const mainMaterial = await Material.findById(
    product.mainMaterial.material
  ).exec();
  const bottomMaterial = await Material.findById(
    product.bottomMaterial.material
  ).exec();

  const prices = [
    pattern?.additionalPrice || 0,
    mainMaterial.additionalPrice,
    bottomMaterial.additionalPrice,
  ];

  const sizesPrice = await Size.find({
    _id: {
      $in: product.sizes,
    },
  }).exec();

  return calculateHelper(prices, sizesPrice, product.basePrice);
};

const finalPriceCalculation = async product => {
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

  return calculateHelper(prices, sizesPrice, product.basePrice);
};

const finalPriceRecalculation = async productId => {
  let { pattern, closure, sizes, mainMaterial, innerMaterial, bottomMaterial } =
    await Product.findById(productId)
      .populate('pattern')
      .populate('closure')
      .populate('sizes.size')
      .populate('mainMaterial.material')
      .populate('innerMaterial.material')
      .populate('bottomMaterial.material')
      .exec();

  const prices = [
    pattern?.additionalPrice || 0,
    closure?.additionalPrice || 0,
    mainMaterial?.material?.additionalPrice || 0,
    innerMaterial?.material?.additionalPrice || 0,
    bottomMaterial?.material?.additionalPrice || 0,
  ];

  const { basePrice } = await Product.findById(productId).exec();

  sizes = sizes.map(size => size.size);

  return calculateHelper(prices, sizes, basePrice);
};

module.exports = {
  finalPriceCalculation,
  finalPriceRecalculation,
  finalPriceCalculationForConstructor,
};
