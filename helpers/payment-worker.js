const CloudIpsp = require('cloudipsp-node-js-sdk');

const {
  PAYMENT_ACTIONS: { CHECK_PAYMENT_STATUS, GO_TO_CHECKOUT },
} = require('../consts/payment-actions');
const { PAYMENT_MERCHANT_ID, PAYMENT_SECRET } = require('../dotenvValidator');

const fondy = new CloudIpsp({
  merchantId: PAYMENT_MERCHANT_ID,
  secretKey: PAYMENT_SECRET,
});

const paymentWorker = async (action, data) => {
  if (action === GO_TO_CHECKOUT) {
    return await fondy
      .Checkout(data)
      .then(res => res)
      .catch(error => error);
  }
  if (action === CHECK_PAYMENT_STATUS) {
    return await fondy
      .Status(data)
      .then(res => res)
      .catch(error => error);
  }
};

module.exports = {
  paymentWorker,
};
