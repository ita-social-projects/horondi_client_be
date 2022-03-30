const { ObjectId } = require('mongoose').Types;
const { PAYMENT_SECRET } = require('../../dotenvValidator');
const { generatePaymentSignature } = require('../../utils/payment.utils');
const RuleError = require('../../errors/rule.error');
const { sendEmail } = require('../email/email.service');
const {
  PAYMENT_DESCRIPTION,
  PAYMENT_ACTIONS: { CHECK_PAYMENT_STATUS, GO_TO_CHECKOUT },
  PAYMENT_TOKEN_LENGTH,
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
const {
  CERTIFICATE_NOT_VALID,
  CERTIFICATE_NOT_FOUND,
} = require('../../error-messages/certificate.messages');
const OrderModel = require('../order/order.model');
const { CertificateModel } = require('../certificate/certificate.model');
const { paymentController } = require('../../helpers/payment-controller');
const {
  ORDER_PAYMENT_STATUS: { APPROVED, PAID },
} = require('../../consts/order-payment-status');
const { IMAGE_LINK } = require('../../dotenvValidator');
const {
  EmailActions: { PAYMENT_ORDER, CERTIFICATE_EMAIL },
} = require('../../consts/email-actions');

class PaymentService {
  async getPaymentCheckout({ orderId, currency, amount }) {
    if (!ObjectId.isValid(orderId)) {
      throw new RuleError(ORDER_NOT_VALID, BAD_REQUEST);
    }

    const isOrderPresent = await OrderModel.findById(orderId).exec();

    if (!isOrderPresent) {
      throw new RuleError(ORDER_NOT_FOUND, BAD_REQUEST);
    }

    const paymentUrl = await paymentController(GO_TO_CHECKOUT, {
      order_id: isOrderPresent.orderNumber,
      order_desc: PAYMENT_DESCRIPTION,
      currency,
      amount,
    });

    if (paymentUrl) {
      return OrderModel.findByIdAndUpdate(
        orderId,
        {
          $set: {
            paymentUrl,
            paymentStatus: PAYMENT_PROCESSING,
          },
        },
        { new: true }
      ).exec();
    }
  }

  async checkCertificatesPaymentStatus(certificateName, paymentToken) {
    const { order_status, response_signature_string, signature } =
      await paymentController(CHECK_PAYMENT_STATUS, {
        order_id: certificateName,
      });

    const signatureWithoutFirstParam = response_signature_string
      .split('|')
      .slice(1);

    const signatureToCheck = PAYMENT_SECRET.split(' ')
      .concat(signatureWithoutFirstParam)
      .join('|');

    const signSignatureToCheck = generatePaymentSignature(signatureToCheck);

    const certificate = await CertificateModel.findOne({
      name: certificateName.toString(),
    }).exec();

    if (!certificate) {
      throw new RuleError(CERTIFICATE_NOT_FOUND, BAD_REQUEST);
    }

    if (
      order_status !== APPROVED.toLowerCase() ||
      signature !== signSignatureToCheck
    ) {
      return;
    }

    await CertificateModel.updateMany(
      { paymentToken },
      {
        $set: {
          paymentStatus: PAID,
        },
      }
    ).exec();

    const updatedCertificates = await CertificateModel.find({
      paymentToken,
    }).exec();

    return { certificates: updatedCertificates };
  }

  async getPaymentCheckoutForCertificates({ certificates, currency, amount }) {
    let isCertificatePresent;
    certificates.forEach(async certificate => {
      if (!ObjectId.isValid(certificate._id)) {
        throw new RuleError(CERTIFICATE_NOT_VALID, BAD_REQUEST);
      }

      isCertificatePresent = await CertificateModel.findById(
        certificate._id
      ).exec();

      if (!isCertificatePresent) {
        throw new RuleError(CERTIFICATE_NOT_FOUND, BAD_REQUEST);
      }
    });

    const certificatesOrderId = certificates[0].name;

    const paymentUrl = await paymentController(GO_TO_CHECKOUT, {
      order_id: certificatesOrderId,
      order_desc: PAYMENT_DESCRIPTION,
      currency,
      amount,
    });

    const paymentToken = paymentUrl.slice(
      paymentUrl.length - PAYMENT_TOKEN_LENGTH
    );

    if (paymentUrl) {
      certificates.forEach(async certificate => {
        await CertificateModel.findByIdAndUpdate(
          certificate._id,
          {
            $set: {
              paymentUrl,
              paymentStatus: PAYMENT_PROCESSING,
              paymentToken,
            },
          },
          { new: true }
        ).exec();
      });
    }

    return {
      paymentUrl,
      paymentToken,
      certificatesOrderId,
    };
  }

  async checkOrderPaymentStatus(order_id, language) {
    const { order_status, response_signature_string, signature } =
      await paymentController(CHECK_PAYMENT_STATUS, {
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

    if (!order) {
      throw new RuleError(ORDER_NOT_FOUND, BAD_REQUEST);
    }

    if (
      order_status !== APPROVED.toLowerCase() ||
      signature !== signSignatureToCheck
    ) {
      return;
    }

    const paidOrder = await OrderModel.findByIdAndUpdate(order._id, {
      $set: {
        paymentStatus: PAID,
      },
    })
      .populate({
        path: 'items.product',
        select: 'name images ',
      })
      .populate({
        path: 'items.options.size ',
        select: 'name',
      })
      .exec();

    await sendEmail(paidOrder.recipient.email, PAYMENT_ORDER, {
      language,
      items: paidOrder.items,
      totalPrice: paidOrder.totalItemsPrice,
      paymentUrl: paidOrder.paymentUrl,
      imagesUrl: IMAGE_LINK,
    });

    return paidOrder;
  }

  async sendCertificatesCodesToEmail(language, certificates) {
    await sendEmail(certificates[0].email, CERTIFICATE_EMAIL, {
      language,
      items: certificates,
    });

    return {
      certificates,
    };
  }
}

module.exports = new PaymentService();
