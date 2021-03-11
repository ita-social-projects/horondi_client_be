const CloudIpsp = require('cloudipsp-node-js-sdk');
const open = require('open');

const {
  PAYMENT_ACTIONS: { CHECK_PAYMENT_STATUS, GO_TO_CHECKOUT },
} = require('../consts/payments');
const { PAYMENT_MERCHANT_ID, PAYMENT_SECRET } = require('../dotenvValidator');
const {
  FONDY_RESPONSE_STATUS: { SUCCESS },
} = require('../consts/fondy-responce-status');

const fondy = new CloudIpsp({
  merchantId: PAYMENT_MERCHANT_ID,
  secretKey: PAYMENT_SECRET,
});

const paymentWorker = async (action, data) => {
  if (action === GO_TO_CHECKOUT) {
    return await fondy
      .Checkout(data)
      .then(({ response_status, checkout_url }) => {
        return response_status === SUCCESS && open(checkout_url);
      })
      .catch(error => error);
  }
  if (action === CHECK_PAYMENT_STATUS) {
    return await fondy
      .Status(data)
      .then(res => {
        return res;
      })
      .catch(error => error);
  }
};

module.exports = {
  paymentWorker,
};
