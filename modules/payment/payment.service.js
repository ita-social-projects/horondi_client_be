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

    console.log(requestData);

    const result = await fondy
      .Checkout(requestData)
      .then(res => res)
      .catch(error => error);

    console.log(result);

    return {
      paymentId: result.payment_id,
      responseStatus: result.response_status,
      checkoutUrl: result.checkout_url,
    };
  }

  // NOT WORKING
  async getPaymentRefund(data) {
    const { orderId, currency, amount } = data;

    const refund = {
      currency,
      amount,
      order_id: orderId,
    };

    const fondy = new CloudIpsp({
      merchantId: PAYMENT_MERCHANT_ID,
      secretKey: PAYMENT_SECRET,
    });

    const res = await fondy
      .Reverse(refund)
      .then(res => res)
      .catch(error => error);

    console.log(res);

    return {
      paymentId: res.data.order_id,
      responseStatus: res.response_status,
      checkoutUrl: res.payment_id,
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

    const res = await fondy
      .Status(req)
      .then(res => res)
      .catch(error => error);

    return {
      orderId: res.order_id,
      orderStatus: res.order_status,
      orderTime: res.order_time,
      amount: res.amount,
      currency: res.currency,
    };
  }
}

module.exports = new PaymentService();
