const paymentService = require('./payment.service');

const paymentQuery = {
  getPaymentCheckout: (parent, args) =>
    paymentService.getPaymentCheckout(args.data),
  getPaymentStatus: (parent, args) =>
    paymentService.getPaymentStatus(args.orderId),
};

module.exports = { paymentQuery };
