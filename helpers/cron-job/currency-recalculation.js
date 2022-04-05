const { schedule } = require('node-cron');

const ProductModel = require('../../modules/product/product.model');
const ConstructorBasicModel = require('../../modules/constructor/constructor-basic/constructor-basic.model');
const ConstructorBottomModel = require('../../modules/constructor/constructor-bottom/constructor-bottom.model');
const ConstructorFrontPocketModel = require('../../modules/constructor/constructor-front-pocket/constructor-front-pocket.model');

const {
  CRON_PERIOD: { EVERY_NIGHT },
} = require('../../consts/cron-period');
const {
  cronRecalculateBasePrice,
  cronRecalculateProductSizePrices,
} = require('../../utils/cron-recalculate-helper');

const modelsWithBasePrice = [
  ProductModel,
  ConstructorBasicModel,
  ConstructorBottomModel,
  ConstructorFrontPocketModel,
];

const currencyRecalculation = () =>
  schedule(EVERY_NIGHT, async () => {
    for (const model of modelsWithBasePrice) {
      await cronRecalculateBasePrice(model);
    }

    await cronRecalculateProductSizePrices(ProductModel);
  });

module.exports = { currencyRecalculation };
