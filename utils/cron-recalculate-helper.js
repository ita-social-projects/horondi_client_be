const {
  calculateBasePrice,
  calculateFinalPrice,
} = require('../modules/currency/currency.utils');

const cronRecalculateBasePrice = async model => {
  const documents = await model.find();
  documents.map(async document => {
    document.basePrice =
      document.basePrice[1] &&
      (await calculateBasePrice(document.basePrice[1].value));
    await document.save();
  });
};

const cronRecalculateProductSizePrices = async model => {
  const documents = await model.find();
  documents.map(async document => {
    document.sizes.map(async size => {
      size.price = await calculateFinalPrice(size.price[1].value);
      await document.save();
    });
  });
};

module.exports = {
  cronRecalculateBasePrice,
  cronRecalculateProductSizePrices,
};
