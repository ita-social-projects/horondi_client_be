const Currency = require('./currency.model');
const {
  CURRENCY: { UAH, USD },
} = require('../../consts/currency');

const calculatePrice = async price => {
  const { convertOptions } = await Currency.findOne().exec();
  return [
    {
      value: Math.round(price * convertOptions[0].exchangeRate * 100),
      currency: UAH,
    },
    {
      value: Math.round(price * 100),
      currency: USD,
    },
  ];
};

module.exports = { calculatePrice };
