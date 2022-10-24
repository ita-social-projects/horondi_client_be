const { ObjectId } = require('mongoose').Types;
const { PAYMENT_SECRET } = require('../../dotenvValidator');
const { generatePaymentSignature } = require('../../utils/payment.utils');
const RuleError = require('../../errors/rule.error');
const pubsub = require('../../pubsub');
const { sendEmail } = require('../email/email.service');
const {
  PAYMENT_DESCRIPTION,
  PAYMENT_ACTIONS: { CHECK_PAYMENT_STATUS, GO_TO_CHECKOUT },
  PAYMENT_TOKEN_LENGTH,
} = require('../../consts/payments');
const {
  PAYMENT_STATUSES: {
    PAYMENT_PROCESSING,
    PAYMENT_PAID,
    PAYMENT_EXPIRED,
    PAYMENT_DECLINED,
    PAYMENT_REVERSED,
  },
} = require('../../consts/payment-statuses');
const {
  STATUS_CODES: { BAD_REQUEST, FORBIDDEN },
} = require('../../consts/status-codes');
const {
  ORDER_NOT_FOUND,
  ORDER_NOT_VALID,
} = require('../../error-messages/orders.messages');
const {
  CERTIFICATE_NOT_VALID,
  CERTIFICATE_NOT_FOUND,
  CERTIFICATE_NOT_PAID,
  CERTIFICATE_IS_PAID,
} = require('../../error-messages/certificate.messages');
const OrderModel = require('../order/order.model');
const { CertificateModel } = require('../certificate/certificate.model');
const { paymentController } = require('../../helpers/payment-controller');
const {
  ORDER_PAYMENT_STATUS: { APPROVED, EXPIRED, DECLINED, REVERSED, PAID },
} = require('../../consts/order-payment-status');
const { IMAGE_LINK } = require('../../dotenvValidator');
const {
  EmailActions: { CERTIFICATE_EMAIL, SUCCESSFUL_ORDER },
} = require('../../consts/email-actions');
const productService = require('../product/product.service');
const materialService = require('../material/material.service');

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
      server_callback_url: `${process.env.FONDY_CALLBACK_URL}order_callback/`,
      response_url: `${process.env.FRONT_BASE_URI}/thanks/${isOrderPresent.orderNumber}`,
      order_id: isOrderPresent.orderNumber,
      order_desc: PAYMENT_DESCRIPTION[0],
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

  async checkCertificatesPaymentStatus(req, res) {
    try {
      const { order_id, merchant_data } = req.body;
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

      const certificate = await CertificateModel.findOne({
        name: order_id.toString(),
      }).exec();

      if (!certificate) {
        throw new RuleError(CERTIFICATE_NOT_FOUND, BAD_REQUEST);
      }

      if (
        order_status !== APPROVED.toLowerCase() ||
        signature !== signSignatureToCheck
      ) {
        throw new RuleError(CERTIFICATE_NOT_PAID, FORBIDDEN);
      }

      await CertificateModel.updateMany(
        { paymentToken: certificate.paymentToken },
        {
          $set: {
            paymentStatus: PAID,
            isActivated: true,
          },
        }
      ).exec();

      const updatedCertificates = await CertificateModel.find({
        paymentToken: certificate.paymentToken,
      }).exec();

      pubsub.publish(CERTIFICATE_IS_PAID, {
        certificatesPaid: updatedCertificates,
      });

      const language = parseInt(merchant_data);
      const dateEnd =
        updatedCertificates[0].dateEnd.toLocaleDateString('uk-UA');

      await sendEmail(updatedCertificates[0].email, CERTIFICATE_EMAIL, {
        language,
        items: updatedCertificates,
        dateEnd,
      });

      res.status(200).end();
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  }

  async getPaymentCheckoutForCertificates({
    certificates,
    currency,
    amount,
    language,
  }) {
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

    const encodedEmail = encodeURIComponent(certificates[0].email);
    const certificatesOrderId = certificates[0].name;
    const fondyLanguage = language ? 'en' : 'uk';
    const responseQuery = encodeURI(
      `?${encodedEmail} ${amount} ${certificatesOrderId}`
    );

    const paymentUrl = await paymentController(GO_TO_CHECKOUT, {
      server_callback_url: `${process.env.FONDY_CALLBACK_URL}certificates_callback/`,
      response_url: `${process.env.FRONT_BASE_URI}/certificatethanks/${responseQuery}`,
      order_id: certificatesOrderId,
      order_desc: PAYMENT_DESCRIPTION[language],
      currency,
      amount,
      merchant_data: language,
      lang: fondyLanguage,
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

  async checkOrderPaymentStatus(req, res) {
    const orderState = req.body;
    const { order_id, order_status, signature } = orderState;

    const signatureKeys = Object.keys(orderState)
      .filter(
        key =>
          orderState[key] !== '' &&
          key !== 'signature' &&
          key !== 'response_signature_string'
      )
      .sort();

    const signatureToCheck = signatureKeys.reduce(
      (acc, key) => `${acc}|${orderState[key]}`,
      PAYMENT_SECRET
    );

    const signSignatureToCheck = generatePaymentSignature(signatureToCheck);

    const order = await OrderModel.findOne({
      orderNumber: order_id.toString(),
    }).exec();

    if (!order) {
      throw new RuleError(ORDER_NOT_FOUND, BAD_REQUEST);
    }

    if (signature !== signSignatureToCheck) {
      throw new RuleError(ORDER_NOT_VALID, BAD_REQUEST);
    }

    const updatePaymentStatus = status => {
      OrderModel.findByIdAndUpdate(order._id, {
        $set: {
          paymentStatus: status,
        },
      }).exec();

      if (order.certificateId && status === PAYMENT_PAID) {
        CertificateModel.findByIdAndUpdate(order.certificateId, {
          $set: { inProgress: false, isUsed: true },
        }).exec();
      }

      if (order.certificateId && status !== PAYMENT_PAID) {
        CertificateModel.findByIdAndUpdate(order.certificateId, {
          $set: { isActivated: true, inProgress: false },
        }).exec();
      }
    };

    switch (order_status.toUpperCase()) {
      case APPROVED: {
        updatePaymentStatus(PAYMENT_PAID);
        break;
      }
      case EXPIRED: {
        updatePaymentStatus(PAYMENT_EXPIRED);
        break;
      }
      case DECLINED: {
        updatePaymentStatus(PAYMENT_DECLINED);
        break;
      }
      case REVERSED: {
        updatePaymentStatus(PAYMENT_REVERSED);
        break;
      }
    }

    res.status(200).end();
  }

  async sendOrderToEmail(language, paidOrderNumber) {
    const paidOrder = await OrderModel.findOne({ orderNumber: paidOrderNumber })
      .populate({
        path: 'items.product',
        select: 'name bottomMaterial images',
      })
      .exec();

    const items = await Promise.all(
      paidOrder.items.map(async item => {
        const size = await productService.getProductSizeById(
          item.product,
          item.options.size
        );
        const bottomMaterial = await materialService.getMaterialById(
          item.product.bottomMaterial.material
        );
        item = item.toObject();

        return {
          ...item,
          product: {
            ...item.product,
            bottomMaterial,
          },
          options: {
            ...item.options,
            size,
          },
        };
      })
    );

    await sendEmail(paidOrder.recipient.email, SUCCESSFUL_ORDER, {
      language,
      items,
      totalPriceToPay: paidOrder.totalPriceToPay,
      fixedExchangeRate: paidOrder.fixedExchangeRate,
      paymentStatus: paidOrder.paymentStatus,
      imagesUrl: IMAGE_LINK,
    });

    return paidOrder;
  }
}

module.exports = new PaymentService();
