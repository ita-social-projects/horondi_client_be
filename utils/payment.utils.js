const { createHash } = require('crypto');

const {
  HASH_FEATURES: { DIGEST, SHA_1 },
} = require('../consts/hash-features');
const bottomService = require('../modules/bottom/bottom.service');
const { sendEmail } = require('../modules/email/email.service');
const materialService = require('../modules/material/material.service');
const orderModel = require('../modules/order/order.model');
const productService = require('../modules/product/product.service');
const {
  EmailActions: { SUCCESSFUL_ORDER },
} = require('../consts/email-actions');
const { IMAGE_LINK } = require('../dotenvValidator');

const generatePaymentSignature = data =>
  createHash(SHA_1).update(data).digest(DIGEST);

const sendOrderToEmail = async (language, paidOrderNumber) => {
  const paidOrder = await orderModel
    .findOne({ orderNumber: paidOrderNumber })
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
      let bottomMaterial;
      if (item.isFromConstructor) {
        bottomMaterial = await bottomService.getBottomById(
          item.product.bottomMaterial.material
        );
      } else {
        bottomMaterial = await materialService.getMaterialById(
          item.product.bottomMaterial.material
        );
      }

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
};

module.exports = {
  generatePaymentSignature,
  sendOrderToEmail,
};
