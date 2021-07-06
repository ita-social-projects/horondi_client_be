const {
  CURRENCY_VALUE: { UAH_VALUE, USD_VALUE },
  CURRENCY: { USD, UAH },
} = require('../consts/currency');

const calculateItemPriceWithSize = (sizePrice, quantity = 1) => [
  {
    currency: UAH,
    value: sizePrice[UAH_VALUE].value * quantity,
  },
  {
    currency: USD,
    value: sizePrice[USD_VALUE].value * quantity,
  },
];
const calculateConstructorItemPriceWithSize = (
  sizePrice,
  constructorBasicsPrice,
  constructorBottomPrice,
  constructorFrontPocketPrice,
  quantity = 1
) => [
  {
    currency: UAH,
    value:
      (sizePrice[UAH_VALUE].value +
        constructorBasicsPrice[UAH_VALUE].value +
        constructorBottomPrice[UAH_VALUE].value +
        constructorFrontPocketPrice[UAH_VALUE].value) *
      quantity,
  },
  {
    currency: USD,
    value:
      (sizePrice[USD_VALUE].value +
        constructorBasicsPrice[USD_VALUE].value +
        constructorBottomPrice[USD_VALUE].value +
        constructorFrontPocketPrice[USD_VALUE].value) *
      quantity,
  },
];

module.exports = {
  calculateItemPriceWithSize,
  calculateConstructorItemPriceWithSize,
};
