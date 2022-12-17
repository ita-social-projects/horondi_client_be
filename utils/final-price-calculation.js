const Product = require('../modules/product/product.model');
const Pattern = require('../modules/pattern/pattern.model');
const Closures = require('../modules/closures/closures.model');
const Material = require('../modules/material/material.model');

const basic = require('../modules/basics/basics.service');
const bottom = require('../modules/bottom/bottom.service');
const modelService = require('../modules/model/model.service');

const checkPriceType = (price, item, basePrice) => {
  if (item.absolutePrice) {
    price += item.absolutePrice;
  }

  if (item.relativePrice) {
    price += basePrice * (item.relativePrice / 100);
  }

  return Math.round(price);
};

const calculateHelper = (entities, sizes, basePrice) => {
  const additionalPrice = entities.reduce(
    (sum, entity) => checkPriceType(sum, entity, basePrice),
    basePrice
  );

  return sizes.map(size => {
    const price = additionalPrice;

    return { size: size._id, price: checkPriceType(price, size, basePrice) };
  });
};

const finalPriceCalculationForConstructor = async product => {
  const basicMaterial = await basic.getBasicById(product.mainMaterial.material);

  const bottomMaterial = await bottom.getBottomById(
    product.bottomMaterial.material
  );

  const prices = [basicMaterial, bottomMaterial];

  if (product.pattern) {
    const pattern = await Pattern.findById(product.pattern).exec();
    prices.push(pattern);
  }

  return calculateHelper(prices, product.model.sizes, product.basePrice);
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

  const sizesPrice = modelService.getModelSizes(product.model, product.sizes);

  const prices = [
    pattern,
    closure,
    mainMaterial,
    innerMaterial,
    bottomMaterial,
  ];

  return calculateHelper(prices, sizesPrice, product.basePrice);
};

const finalPriceRecalculation = async productId => {
  const {
    pattern,
    closure,
    model: modelId,
    sizes: productSizes,
    mainMaterial,
    innerMaterial,
    bottomMaterial,
  } = await Product.findById(productId)
    .populate('pattern')
    .populate('closure')
    .populate('model')
    .populate('mainMaterial.material')
    .populate('innerMaterial.material')
    .populate('bottomMaterial.material')
    .exec();

  const prices = [
    pattern,
    closure,
    mainMaterial.material,
    innerMaterial.material,
    bottomMaterial.material,
  ];

  const { basePrice } = await Product.findById(productId).exec();

  const productSizesIds = productSizes.map(size => size.size.toString());
  const sizes = modelService.getModelSizes(modelId, productSizesIds);

  return calculateHelper(prices, sizes, basePrice);
};

module.exports = {
  finalPriceCalculation,
  finalPriceRecalculation,
  finalPriceCalculationForConstructor,
};
