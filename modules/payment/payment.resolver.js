const paymentService = require('./payment.service');
const RuleError = require('../../errors/rule.error');

const paymentQuery = {
  getPaymentCheckout: async (_, { data, language }) => {
    try {
      return await paymentService.getPaymentCheckout(data, language);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { paymentQuery };
