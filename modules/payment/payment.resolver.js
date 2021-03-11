const paymentService = require('./payment.service');
const RuleError = require('../../errors/rule.error');

const paymentQuery = {
  getPaymentCheckout: (_, { data }) => {
    try {
      return paymentService.getPaymentCheckout(data);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  checkPaymentStatus: (parent, args) =>
    paymentService.checkPaymentStatus(args.orderId),
};

module.exports = { paymentQuery };
