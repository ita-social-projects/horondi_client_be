const Currency = require('./currency.model');
const {
  CURRENCY: { UAH, USD },
} = require('../../consts/currency');

const calculateBasePrice = async price => {
  const { convertOptions } = await Currency.findOne().exec();

  return [
    {
      value: Math.round(price * convertOptions[0].exchangeRate * 100) / 100,
      currency: UAH,
    },
    {
      value: price,
      currency: USD,
    },
  ];
};

const calculateFinalPrice = async price => {
  const { convertOptions } = await Currency.findOne().exec();

  return [
    {
      value: Math.round((price * convertOptions[0].exchangeRate) / 50) * 50,
      currency: UAH,
    },
    {
      value: price,
      currency: USD,
    },
  ];
};

module.exports = {
  calculateBasePrice,
  calculateFinalPrice,
};
