const axios = require('axios');
const CloudIpsp = require('cloudipsp-node-js-sdk');
const crypto = require('crypto');
const {
  PAYMENT_MERCHANT_ID,
  PAYMENT_SECRET,
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
      .createHash('sha1')
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

  async getPaymentRefund({ orderId, currency, amount }) {
    const data = {
      orderId,
      currency,
      amount,
      merchantId: PAYMENT_MERCHANT_ID,
    };
    const sig = this.genSignature(data, PAYMENT_SECRET);

    const res = await axios.post(PAYMENT_API_LINK, {
      request: {
        order_id: orderId,
        currency,
        amount,
        merchant_id: PAYMENT_MERCHANT_ID,
        signature: sig,
      },
    });

    return {
      paymentId: res.data.response.payment_id,
      responseStatus: res.data.response.response_status,
      checkoutUrl: res.data.response.checkout_url,
    };
  }
}

module.exports = new PaymentService();
