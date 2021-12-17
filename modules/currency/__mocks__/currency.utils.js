const {
  CURRENCY: { UAH, USD },
} = require('../../../consts/currency');
const {
  ADDITIONAL_PRICE_TYPES: { ABSOLUTE_INDICATOR },
} = require('../../../consts/additional-price-types');

const calculateBasePrice = async (price) => [
  {
    value: 2700,
    currency: UAH,
  },
  {
    value: 100,
    currency: USD,
  },
];

const calculateAdditionalPrice = async (price) => [
  {
    value: 270,
    type: ABSOLUTE_INDICATOR,
    currency: UAH,
  },
  {
    value: 10,
    type: ABSOLUTE_INDICATOR,
    currency: USD,
  },
];

const calculateFinalPrice = async (price) => [
  {
    value: 3700,
    currency: UAH,
  },
  {
    value: 100,
    currency: USD,
  },
];

module.exports = {
  calculateBasePrice,
  calculateAdditionalPrice,
  calculateFinalPrice,
};
