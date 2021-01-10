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

function calculateTotalItemsPrice(items) {
  let USD = 0;
  let UAN = 0;

  for (const item of items) {
    const { quantity, actualPrice } = item;
    UAN +=
      actualPrice[0].currency === 'UAN'
        ? actualPrice[0].value * quantity
        : actualPrice[1].value * quantity;
    USD +=
      actualPrice[0].currency === 'USD'
        ? actualPrice[0].value * quantity
        : actualPrice[1].value * quantity;
  }

  return [
    { value: UAN, currency: 'UAN' },
    { value: USD, currency: 'USD' },
  ];
}

module.exports = {
  calculatePrice,
  calculateTotalItemsPrice,
};
