const currencyService = require('./currency.service');

const calculatePrice = async price => {
  const { convertOptions } = await currencyService.findOne();

  return [
    {
      value: Math.round(price * convertOptions[0].exchangeRate * 100),
      currency: 'UAH',
    },
    {
      value: Math.round(price * 100),
      currency: 'USD',
    },
  ];
};

module.exports = {
  calculatePrice,
};
