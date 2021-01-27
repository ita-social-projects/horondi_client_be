const Currency = require('./currency.model');

const calculatePrice = async price => {
  const { convertOptions } = Currency.findOne();
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

module.exports = { calculatePrice };
