const { isAuthorized } = require('../../utils/rules');

const paymentQuery = {
  getPaymentCheckout: isAuthorized,
};

module.exports = { paymentQuery };
