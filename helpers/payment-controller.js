const CloudIpsp = require('cloudipsp-node-js-sdk');

const RuleError = require('../errors/rule.error');
const {
  PAYMENT_ACTIONS: { CHECK_PAYMENT_STATUS, GO_TO_CHECKOUT },
} = require('../consts/payments');
const { PAYMENT_MERCHANT_ID, PAYMENT_SECRET } = require('../dotenvValidator');
const {
  FONDY_RESPONSE_STATUS: { SUCCESS },
} = require('../consts/fondy-responce-status');
const {
  PAYMENT_MESSAGES: { PAYMENT_CHECKOUT_URL_IS_NOT_AVAILABLE },
} = require('../error-messages/payment.messages');
const {
  STATUS_CODES: { FORBIDDEN },
} = require('../consts/status-codes');

const fondy = new CloudIpsp({
  merchantId: PAYMENT_MERCHANT_ID,
  secretKey: PAYMENT_SECRET,
});

const paymentController = async (action, data) => {
  if (action === GO_TO_CHECKOUT) {
    return fondy.Checkout(data).then(({ response_status, checkout_url }) => {
      if (response_status === SUCCESS) {
        return checkout_url;
      } else {
        throw new RuleError(PAYMENT_CHECKOUT_URL_IS_NOT_AVAILABLE, FORBIDDEN);
      }
    });
  }
  if (action === CHECK_PAYMENT_STATUS) {
    return fondy
      .Status(data)
      .then(res => {
        return res;
      })
      .catch(error => error);
  }
};

module.exports = {
  paymentController,
};
