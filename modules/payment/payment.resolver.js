const paymentService = require('./payment.service');

const paymentQuery = {
  getPaymentCheckout: (parent, args) =>
    paymentService.getPaymentCheckout(args.data),
  checkPaymentStatus: (parent, args) =>
    paymentService.checkPaymentStatus(args.orderId),
};

module.exports = { paymentQuery };
