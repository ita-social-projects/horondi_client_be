const {
  CURRENCY: { UAH, USD },
} = require('../../../consts/currency');

const calculatePrice = async price => [
  {
    currency: UAH,
    exchangeRate: 24,
  },
  {
    name: USD,
    exchangeRate: 1,
  },
];

module.exports = { calculatePrice };
