const { calculateAdditionalPrice, calculateBasePrice } = require('../modules/currency/currency.utils');
const {
  ADDITIONAL_PRICE_TYPES: {
    ABSOLUTE_INDICATOR,
  },
} = require('../consts/additional-price-types');

const cronRecalculateAdditionalPrice = async (model) => {
  for await (const document of model.find()) {
    if (document.additionalPrice[0].type === ABSOLUTE_INDICATOR) {
      document.additionalPrice = await calculateAdditionalPrice(document.additionalPrice[1]);
      await document.save();
    }
  }
};

const cronRecalculateBasePrice = async (model) => {
  for await (const document of model.find()) {
    if (document.basePrice[1]) {
      document.basePrice = await calculateBasePrice(document.basePrice[1].value);
    }
    await document.save();
  }
};

const cronRecalculatePocketBack = async (model) => {
  for await (const document of model.find()) {
    if (document.additionalPrice[1]) {
      document.additionalPrice = await calculateBasePrice(document.additionalPrice[1].value);
    }
    await document.save();
  }
};

module.exports = { cronRecalculateAdditionalPrice, cronRecalculateBasePrice, cronRecalculatePocketBack };

