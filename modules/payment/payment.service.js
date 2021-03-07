const ObjectId = require('mongoose').Types.ObjectId;

const RuleError = require('../../errors/rule.error');
const {
  PAYMENT_DESCRIPTION,
  PAYMENT_ACTIONS: { CHECK_PAYMENT_STATUS, GO_TO_CHECKOUT },
} = require('../../consts/payments');
const {
  STATUS_CODES: { BAD_REQUEST },
} = require('../../consts/status-codes');
const {
  ORDER_NOT_FOUND,
  ORDER_NOT_VALID,
} = require('../../error-messages/orders.messages');
const OrderModel = require('../order/order.model');
const { paymentWorker } = require('../../helpers/payment-worker');
const { generateOrderNumber } = require('../../utils/order.utils');

class PaymentService {
  async getPaymentCheckout({ orderId, orderNumber, currency, amount }) {
    if (!ObjectId.isValid(orderId))
      throw new RuleError(ORDER_NOT_VALID, BAD_REQUEST);

    const isOrderPresent = await OrderModel.findById(id);

    if (!isOrderPresent) throw new RuleError(ORDER_NOT_FOUND, BAD_REQUEST);

    await paymentWorker(GO_TO_CHECKOUT, {
      order_id: orderNumber,
      order_desc: PAYMENT_DESCRIPTION,
      currency,
      amount,
    });

    const newOrderNumber = generateOrderNumber();

    return OrderModel.findByIdAndUpdate(
      orderId,
      { $set: { orderNumber: newOrderNumber } },
      { new: true }
    );
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
