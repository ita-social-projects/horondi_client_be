const paymentService = require('./payment.service');

const paymentQuery = {
  getPaymentCheckout: async (_, { data }) =>
    paymentService.getPaymentCheckout(data),
  getPaymentCheckoutForCertificates: async (_, { data }) =>
    paymentService.getPaymentCheckoutForCertificates(data),
  sendCertificatesCodesToEmail: async (_, { language, certificates }) =>
    paymentService.sendCertificatesCodesToEmail(language, certificates),
  sendOrderToEmail: async (_, { language, paidOrderNumber }) =>
    paymentService.sendOrderToEmail(language, paidOrderNumber),
};

module.exports = { paymentQuery };
