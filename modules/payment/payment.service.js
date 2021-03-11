const ObjectId = require('mongoose').Types.ObjectId;

const RuleError = require('../../errors/rule.error');
const {
  PAYMENT_DESCRIPTION,
  PAYMENT_ACTIONS: { CHECK_PAYMENT_STATUS, GO_TO_CHECKOUT },
} = require('../../consts/payments');
const {
  STATUS_CODES: { BAD_REQUEST, FORBIDDEN },
} = require('../../consts/status-codes');
const {
  ORDER_NOT_FOUND,
  ORDER_NOT_VALID,
  ORDER_IS_NOT_PAID,
} = require('../../error-messages/orders.messages');
const OrderModel = require('../order/order.model');
const { paymentWorker } = require('../../helpers/payment-worker');
const { generateOrderNumber } = require('../../utils/order.utils');
const {
  ORDER_PAYMENT_STATUS: { APPROVED, PAID },
} = require('../../consts/order-payment-status');

class PaymentService {
  async getPaymentCheckout({ orderId, currency, amount }) {
    if (!ObjectId.isValid(orderId))
      throw new RuleError(ORDER_NOT_VALID, BAD_REQUEST);

    const isOrderPresent = await OrderModel.findById(orderId);

    if (!isOrderPresent) throw new RuleError(ORDER_NOT_FOUND, BAD_REQUEST);

    await paymentWorker(GO_TO_CHECKOUT, {
      order_id: isOrderPresent.orderNumber,
      order_desc: PAYMENT_DESCRIPTION,
      currency,
      amount,
    });

    const newOrderNumber = generateOrderNumber();
    console.log(isOrderPresent.orderNumber);
    console.log(newOrderNumber);

    return OrderModel.findByIdAndUpdate(
      orderId,
      {
        $set: {
          paidOrderNumber: isOrderPresent.orderNumber,
          orderNumber: newOrderNumber,
        },
      },
      { new: true }
    );
  }

  async checkPaymentStatus(req, res) {
    try {
      const { order_id, order_status } = await paymentWorker(
        CHECK_PAYMENT_STATUS,
        {
          order_id: '611122214',
        }
      );

      const order = await OrderModel.findOne({ paidOrderNumber: order_id });

      if (!order) throw new RuleError(ORDER_NOT_FOUND, BAD_REQUEST);
      if (order_status !== APPROVED.toLowerCase())
        throw new RuleError(ORDER_IS_NOT_PAID, FORBIDDEN);

      await OrderModel.findByIdAndUpdate(order._id, {
        $set: { paymentStatus: PAID },
      });

      res.end();
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  }
}

module.exports = new PaymentService();
