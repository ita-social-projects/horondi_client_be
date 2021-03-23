const ObjectId = require('mongoose').Types.ObjectId;
const {
  PAYMENT_MERCHANT_ID,
  PAYMENT_SECRET,
} = require('../../dotenvValidator');
const { generatePaymentSignature } = require('../../utils/payment.utils');
const RuleError = require('../../errors/rule.error');
const {
  PAYMENT_DESCRIPTION,
  PAYMENT_ACTIONS: { CHECK_PAYMENT_STATUS, GO_TO_CHECKOUT },
} = require('../../consts/payments');
const {
  PAYMENT_STATUSES: { PAYMENT_PROCESSING },
} = require('../../consts/payment-statuses');
const {
  STATUS_CODES: { BAD_REQUEST, FORBIDDEN },
} = require('../../consts/status-codes');
const {
  ORDER_NOT_FOUND,
  ORDER_NOT_VALID,
  ORDER_IS_NOT_PAID,
} = require('../../error-messages/orders.messages');
const OrderModel = require('../order/order.model');
const { paymentController } = require('../../helpers/payment-controller');
const {
  ORDER_PAYMENT_STATUS: { APPROVED, PAID },
} = require('../../consts/order-payment-status');

class PaymentService {
  async getPaymentCheckout({ orderId, currency, amount }) {
    if (!ObjectId.isValid(orderId))
      throw new RuleError(ORDER_NOT_VALID, BAD_REQUEST);

    const isOrderPresent = await OrderModel.findById(orderId).exec();

    if (!isOrderPresent) throw new RuleError(ORDER_NOT_FOUND, BAD_REQUEST);

    const signature = generatePaymentSignature(
      `${PAYMENT_SECRET}|${amount}|${currency}|${PAYMENT_MERCHANT_ID}|${PAYMENT_DESCRIPTION}|${isOrderPresent.orderNumber}`
    );

    const paymentUrl = await paymentController(GO_TO_CHECKOUT, {
      order_id: isOrderPresent.orderNumber,
      order_desc: PAYMENT_DESCRIPTION,
      currency,
      amount,
      signature,
    });

    if (paymentUrl) {
      return OrderModel.findByIdAndUpdate(
        orderId,
        {
          $set: {
            signature,
            paymentUrl,
            paymentStatus: PAYMENT_PROCESSING,
          },
        },
        { new: true }
      ).exec();
    }
  }

  async checkPaymentStatus(req, res) {
    try {
      // const { order_id } = req.body;

      const { order_id, order_status } = await paymentController(
        CHECK_PAYMENT_STATUS,
        {
          order_id: 'kRPR6M',
        }
      );

      const order = await OrderModel.findOne({ orderNumber: order_id }).exec();

      if (!order) throw new RuleError(ORDER_NOT_FOUND, BAD_REQUEST);

      if (order_status !== APPROVED.toLowerCase())
        throw new RuleError(ORDER_IS_NOT_PAID, FORBIDDEN);

      await OrderModel.findByIdAndUpdate(order._id, {
        $set: {
          paymentStatus: PAID,
        },
      }).exec();

      res.end();
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  }
}

module.exports = new PaymentService();
