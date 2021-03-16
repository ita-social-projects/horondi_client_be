const {
  CART_TOTAL_SUM_METHOD: { ADD_ITEM },
} = require('../consts/cart-total-sum-method');

const totalCartSum = (calculateMethod, newItemSum, cartSum) =>
  calculateMethod === ADD_ITEM
    ? Object.values(
        [...newItemSum, ...cartSum].reduce((acc, { currency, value }) => {
          acc[currency] = {
            currency,
            value: (acc[currency] ? acc[currency].value : 0) + value,
          };
          return acc;
        }, {})
      )
    : Object.values(
        [...newItemSum, ...cartSum].reduce((acc, { currency, value }) => {
          acc[currency] = {
            currency,
            value: value - (acc[currency] ? acc[currency].value : 0),
          };
          return acc;
        }, {})
      );

module.exports = {
  totalCartSum,
};
