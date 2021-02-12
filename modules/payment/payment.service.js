const CloudIpsp = require('cloudipsp-node-js-sdk');
const crypto = require('crypto');

const {
  PAYMENT_MERCHANT_ID,
  PAYMENT_SECRET,
  CRYPTO,
} = require('../../dotenvValidator');

class PaymentService {
  genSignature(data, secret) {
    const ordered = {};

    Object.keys(data)
      .sort()
      .forEach(function(key) {
        if (
          data[key] !== '' &&
          key !== 'signature' &&
          key !== 'response_signature_string'
        ) {
          ordered[key] = data[key];
        }
      });
    const signString = secret + '|' + Object.values(ordered).join('|');

    return crypto
      .createHash(CRYPTO)
      .update(signString)
      .digest('hex');
  }

  async getPaymentCheckout(data) {
    const { orderId, orderDesc, currency, amount } = data;

    const fondy = new CloudIpsp({
      merchantId: PAYMENT_MERCHANT_ID,
      secretKey: PAYMENT_SECRET,
    });

    const requestData = {
      order_id: orderId,
      order_desc: orderDesc,
      currency,
      amount,
    };

    const result = await fondy
      .Checkout(requestData)
      .then(res => res)
      .catch(error => error);

    return {
      paymentId: result.payment_id,
      responseStatus: result.response_status,
      checkoutUrl: result.checkout_url,
    };
  }

  async getPaymentStatus(orderId) {
    const fondy = new CloudIpsp({
      merchantId: PAYMENT_MERCHANT_ID,
      secretKey: PAYMENT_SECRET,
    });

    const req = {
      order_id: orderId,
    };

    const result = await fondy
      .Status(req)
      .then(res => res)
      .catch(error => error);

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
