const {
  calculateAdditionalPrice,
  calculateBasePrice,
  calculateFinalPrice,
} = require('../modules/currency/currency.utils');
const {
  ADDITIONAL_PRICE_TYPES: { ABSOLUTE_INDICATOR },
} = require('../consts/additional-price-types');

const cronRecalculateAdditionalPrice = async (model) => {
  const documents = await model.find();
  documents.map(async (document) => {
    document.additionalPrice =
      document.additionalPrice[1].type === ABSOLUTE_INDICATOR &&
      (await calculateAdditionalPrice(document.additionalPrice[1]));
    await document.save();
  });
};

const cronRecalculateBasePrice = async (model) => {
  const documents = await model.find();
  documents.map(async (document) => {
    document.basePrice =
      document.basePrice[1] &&
      (await calculateBasePrice(document.basePrice[1].value));
    await document.save();
  });
};

const cronRecalculatePocketBack = async (model) => {
  const documents = await model.find();
  documents.map(async (document) => {
    document.additionalPrice =
      document.additionalPrice[1] &&
      (await calculateBasePrice(document.additionalPrice[1].value));
    await document.save();
  });
};

const cronRecalculateProductSizePrices = async (model) => {
  const documents = await model.find();
  documents.map(async (document) => {
    document.sizes.map(async (size) => {
      size.price = await calculateFinalPrice(size.price[1].value);
      await document.save();
    });
  });
};

module.exports = {
  cronRecalculateAdditionalPrice,
  cronRecalculateBasePrice,
  cronRecalculatePocketBack,
  cronRecalculateProductSizePrices,
};
