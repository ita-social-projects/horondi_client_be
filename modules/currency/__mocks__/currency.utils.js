const Currency = require('./currency.model');

const calculatePrice = async price => {
  const { convertOptions } = await Currency.findOne();
  return [
    {
      currency: 'UAH',
      exchangeRate: 24,
    },
    {
      name: 'USD',
      exchangeRate: 1,
    },
  ];
};

module.exports = { calculatePrice };
