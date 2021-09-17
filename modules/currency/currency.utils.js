const Currency = require('./currency.model');
const {
  CURRENCY: { UAH, USD },
} = require('../../consts/currency');
const {
  ADDITIONAL_PRICE_TYPES: { ABSOLUTE_INDICATOR, RELATIVE_INDICATOR },
} = require('../../consts/additional-price-types');

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

const calculateAdditionalPrice = async price => {
  const { value, type } = price;
  const { convertOptions } = await Currency.findOne().exec();
  switch (type) {
    case ABSOLUTE_INDICATOR: {
      return [
        {
          value: Math.round(value * convertOptions[0].exchangeRate * 100) / 100,
          type: ABSOLUTE_INDICATOR,
          currency: UAH,
        },
        {
          value,
          type: ABSOLUTE_INDICATOR,
          currency: USD,
        },
      ];
    }
    case RELATIVE_INDICATOR: {
      return {
        value,
        type: RELATIVE_INDICATOR,
        currency: null,
      };
    }
    default:
      return null;
  }
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
  calculateAdditionalPrice,
  calculateFinalPrice,
};
