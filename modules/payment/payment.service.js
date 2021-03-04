const CloudIpsp = require('cloudipsp-node-js-sdk');
const crypto = require('crypto');

const {
  PAYMENT_ACTIONS: { CHECK_PAYMENT_STATUS, GO_TO_CHECKOUT },
} = require('../../consts/payment-actions');
const { paymentWorker } = require('../../helpers/payment-worker');

class PaymentService {
  // genSignature(data, secret) {
  //   const ordered = {};
  //
  //   Object.keys(data)
  //     .sort()
  //     .forEach(function(key) {
  //       if (
  //         data[key] !== '' &&
  //         key !== 'signature' &&
  //         key !== 'response_signature_string'
  //       ) {
  //         ordered[key] = data[key];
  //       }
  //     });
  //   const signString = secret + '|' + Object.values(ordered).join('|');
  //
  //   return crypto
  //     .createHash(CRYPTO)
  //     .update(signString)
  //     .digest('hex');
  // }

  async getPaymentCheckout(data) {
    const { orderId, orderDesc, currency, amount } = data;

    const requestData = {
      order_id: orderId,
      order_desc: orderDesc,
      currency,
      amount,
    };

    const result = await paymentWorker(GO_TO_CHECKOUT, requestData);

    return {
      paymentId: result.payment_id,
      responseStatus: result.response_status,
      checkoutUrl: result.checkout_url,
    };
  }

  async checkPaymentStatus(orderId) {
    const req = {
      order_id: orderId,
    };

    const result = await paymentWorker(CHECK_PAYMENT_STATUS, orderId);

    return {
      orderId: result.order_id,
      orderStatus: result.order_status,
      orderTime: result.order_time,
      amount: result.amount,
      currency: result.currency,
    };
  }
}

module.exports = new PaymentService();
