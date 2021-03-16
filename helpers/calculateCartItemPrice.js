const {
  CURRENCY_VALUE: { UAH_VALUE, USD_VALUE },
  CURRENCY: { USD, UAH },
} = require('../consts/currency');

const calculateCartItemPriceWithSize = (sizePrice, quantity = 1) => [
  {
    currency: UAH,
    value: sizePrice[UAH_VALUE].value * quantity,
  },
  {
    currency: USD,
    value: sizePrice[USD_VALUE].value * quantity,
  },
];

module.exports = {
  calculateCartItemPriceWithSize,
};
