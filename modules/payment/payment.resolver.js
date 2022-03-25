const paymentService = require('./payment.service');

const paymentQuery = {
  getPaymentCheckout: async (_, { data }) =>
    paymentService.getPaymentCheckout(data),
  getPaymentCheckoutForCertificates: async (_, { data }) =>
    paymentService.getPaymentCheckoutForCertificates(data),
  checkOrderPaymentStatus: async (_, { orderId, language }) => {
    paymentService.checkOrderPaymentStatus(orderId, language);
  },
  checkCertificatesPaymentStatus: async (
    _,
    { certificateName, paymentToken }
  ) =>
    paymentService.checkCertificatesPaymentStatus(
      certificateName,
      paymentToken
    ),
  sendCertificatesCodesToEmail: async (_, { language, certificates }) =>
    paymentService.sendCertificatesCodesToEmail(language, certificates),
};

module.exports = { paymentQuery };
