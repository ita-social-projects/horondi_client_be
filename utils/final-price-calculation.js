const Product = require('../modules/product/product.model');
const Pattern = require('../modules/pattern/pattern.model');
const Closures = require('../modules/closures/closures.model');
const Material = require('../modules/material/material.model');
const Size = require('../modules/size/size.model');

const checkPriceType = (price, item) => {
  if (item.absolutePrice) {
    price += item.absolutePrice;
  }

  if (item.relativePrice) {
    price += price * (item.relativePrice / 100);
  }

  return Math.round(price);
};

const calculateHelper = (entities, sizes, basePrice) => {
  const additionalPrice = entities.reduce(
    (sum, entity) => checkPriceType(sum, entity),
    basePrice
  );

  return sizes.map(size => {
    const price = additionalPrice;

    return { size: size._id, price: checkPriceType(price, size) };
  });
};

const finalPriceCalculationForConstructor = async product => {
  const pattern = await Pattern.findById(product.pattern).exec();
  const mainMaterial = await Material.findById(
    product.mainMaterial.material
  ).exec();
  const bottomMaterial = await Material.findById(
    product.bottomMaterial.material
  ).exec();
  const sizesPrice = await Size.find({
    _id: {
      $in: product.sizes,
    },
  }).exec();

  const prices = [pattern, mainMaterial, bottomMaterial];

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
  const sizesPrice = await Size.find({
    _id: {
      $in: product.sizes,
    },
  }).exec();

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
    pattern,
    closure,
    mainMaterial.material,
    innerMaterial.material,
    bottomMaterial.material,
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
