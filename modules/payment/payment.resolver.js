const paymentService = require('./payment.service');
const RuleError = require('../../errors/rule.error');

const paymentQuery = {
  getPaymentCheckout: async (_, { data }) => {
    try {
      return await paymentService.getPaymentCheckout(data);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { paymentQuery };
