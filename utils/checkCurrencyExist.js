const Currency = require('../modules/currency/currency.model');

const checkCurrencyExist = async data => {
  const currency = await Currency.find({
    convertOptions: {
      $elemMatch: {
        $or: [
          { name: data.convertOptions[0].name },
          { name: data.convertOptions[1].name },
        ],
      },
    },
  });
  return currency.length > 0;
};

module.exports = checkCurrencyExist;
