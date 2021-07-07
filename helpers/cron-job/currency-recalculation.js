const { schedule } = require('node-cron');

const ProductModel = require('../../modules/product/product.model');
const ConstructorBasicModel = require('../../modules/constructor/constructor-basic/constructor-basic.model');
const ConstructorBottomModel = require('../../modules/constructor/constructor-bottom/constructor-bottom.model');
const ConstructorFrontPocketModel = require('../../modules/constructor/constructor-front-pocket/constructor-front-pocket.model');
const PocketModel = require('../../modules/pocket/pocket.model');
const BackModel = require('../../modules/back/back.model');
const SizeModel = require('../../modules/size/size.model');
const PatternModel = require('../../modules/pattern/pattern.model');
const MaterialModel = require('../../modules/material/material.model');
const ClosuresModel = require('../../modules/closures/closures.model');
const {
  CRON_PERIOD: { EVERY_NIGHT },
} = require('../../consts/cron-period');
const {
  cronRecalculateAdditionalPrice,
  cronRecalculateBasePrice,
  cronRecalculatePocketBack,
  cronRecalculateProductSizePrices,
} = require('../../utils/cron-recalculate-helper');

const modelsWithBasePrice = [
  ProductModel,
  ConstructorBasicModel,
  ConstructorBottomModel,
  ConstructorFrontPocketModel,
];
const modelsWithAdditionalPrice = [
  SizeModel,
  PatternModel,
  MaterialModel,
  ClosuresModel,
];
const modelsPocketAndBack = [PocketModel, BackModel];

const currencyRecalculation = () =>
  schedule(EVERY_NIGHT, async () => {
    for (const model of modelsWithBasePrice) {
      await cronRecalculateBasePrice(model);
    }

    for (const model of modelsPocketAndBack) {
      await cronRecalculatePocketBack(model);
    }

    for (const model of modelsWithAdditionalPrice) {
      await cronRecalculateAdditionalPrice(model);
    }

    await cronRecalculateProductSizePrices(ProductModel);
  });

module.exports = { currencyRecalculation };
