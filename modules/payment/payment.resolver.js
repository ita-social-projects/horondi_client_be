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
  getPaymentCheckoutForCertificates: async (_, { data }) => {
    try {
      return await paymentService.getPaymentCheckoutForCertificates(data);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  checkOrderPaymentStatus: async (_, { orderId, language }) => {
    try {
      return await paymentService.checkOrderPaymentStatus(orderId, language);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  checkCertificatesPaymentStatus: async (
    _,
    { certificateName, paymentToken }
  ) => {
    try {
      return await paymentService.checkCertificatesPaymentStatus(
        certificateName,
        paymentToken
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  sendCertificatesCodesToEmail: async (_, { language, certificates }) => {
    try {
      return await paymentService.sendCertificatesCodesToEmail(
        language,
        certificates
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { paymentQuery };
