const { ObjectId } = require('mongoose').Types;
const { PAYMENT_SECRET } = require('../../dotenvValidator');
const { generatePaymentSignature } = require('../../utils/payment.utils');
const RuleError = require('../../errors/rule.error');
const { sendEmail } = require('../email/email.service');
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
const { IMAGE_LINK } = require('../../dotenvValidator');
const {
  EmailActions: { PAYMENT_ORDER },
} = require('../../consts/email-actions');

class PaymentService {
  async getPaymentCheckout({ orderId, currency, amount }, { language }) {
    if (!ObjectId.isValid(orderId))
      throw new RuleError(ORDER_NOT_VALID, BAD_REQUEST);

    const isOrderPresent = await OrderModel.findById(orderId).exec();

    if (!isOrderPresent) throw new RuleError(ORDER_NOT_FOUND, BAD_REQUEST);

    const paymentUrl = await paymentController(GO_TO_CHECKOUT, {
      order_id: isOrderPresent.orderNumber,
      order_desc: PAYMENT_DESCRIPTION,
      currency,
      amount,
    });

    if (paymentUrl) {
      const order = await OrderModel.findByIdAndUpdate(
        orderId,
        {
          $set: {
            paymentUrl,
            paymentStatus: PAYMENT_PROCESSING,
          },
        },
        { new: true }
      )
        .populate({
          path: 'items.product',
          select: 'name images ',
        })
        .populate({
          path: 'items.options.size ',
          select: 'name',
        })
        .exec();
      await sendEmail(order.user.email, PAYMENT_ORDER, {
        language,
        items: order.items,
        totalPrice: order.totalItemsPrice,
        paymentUrl: order.paymentUrl,
        imagesUrl: IMAGE_LINK,
      });
      return order;
    }
  }

  async checkPaymentStatus(req, res) {
    try {
      const { order_id } = req.body;

      const {
        order_status,
        response_signature_string,
        signature,
      } = await paymentController(CHECK_PAYMENT_STATUS, {
        order_id,
      });

      const signatureWithoutFirstParam = response_signature_string
        .split('|')
        .slice(1);

      const signatureToCheck = PAYMENT_SECRET.split(' ')
        .concat(signatureWithoutFirstParam)
        .join('|');

      const signSignatureToCheck = generatePaymentSignature(signatureToCheck);

      const order = await OrderModel.findOne({
        orderNumber: order_id.toString(),
      }).exec();

      if (!order) throw new RuleError(ORDER_NOT_FOUND, BAD_REQUEST);

      if (
        order_status !== APPROVED.toLowerCase() ||
        signature !== signSignatureToCheck
      ) {
        throw new RuleError(ORDER_IS_NOT_PAID, FORBIDDEN);
      }

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
