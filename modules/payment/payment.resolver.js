const paymentService = require('./payment.service');

const paymentQuery = {
  getPaymentCheckout: (parent, args) =>
    paymentService.getPaymentCheckout(args.data),
  getPaymentRefund: (parent, args) =>
    paymentService.getPaymentRefund(args.data),
};

module.exports = { paymentQuery };
