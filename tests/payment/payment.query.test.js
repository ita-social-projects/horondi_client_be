const mongoose = require('mongoose');
const paymentService = require('../../modules/payment/payment.service');
const { deleteOrder, createOrder } = require('../order/order.helpers');
const { newOrderInputData } = require('../order/order.variables');
const { newProductInputData } = require('../product/product.variables');
const { createProduct, deleteProducts } = require('../product/product.helper');
const {
  deleteConstructorBasic,
  createConstructorBasic,
} = require('../constructor-basic/constructor-basic.helper');
const { ORDER_NOT_VALID } = require('../../error-messages/orders.messages');
const {
  CERTIFICATE_IS_USED,
} = require('../../error-messages/certificate.messages');
const {
  PAYMENT_STATUSES: { PAYMENT_APPROVED, PAYMENT_DECLINED },
} = require('../../consts/payment-statuses');
const {
  CERTIFICATE_UPDATE_STATUS: { USED },
} = require('../../consts/certificate-update-status');
const {
  newConstructorBasic,
} = require('../constructor-basic/constructor-basic.variables');
const { createColor, deleteColor } = require('../color/color.helper');
const { color } = require('../color/color.variables');
const {
  createMaterial,
  deleteMaterial,
} = require('../materials/material.helper');
const { getMaterial } = require('../materials/material.variables');
const {
  createCategory,
  deleteCategory,
} = require('../category/category.helper');
const { newCategoryInputData } = require('../category/category.variables');
const { createClosure, deleteClosure } = require('../closure/closure.helper');
const { newClosure } = require('../closure/closure.variables');
const { createModel, deleteModel } = require('../model/model.helper');
const { newModel } = require('../model/model.variables');
const { createPattern, deletePattern } = require('../pattern/pattern.helper');
const { queryPatternToAdd } = require('../pattern/pattern.variables');
const { setupApp } = require('../helper-functions');

const {
  generateCertificate,
  deleteCertificate,
  getCertificateByParams,
  updateCertificate,
} = require('../certificate/certificate.helper');

const {
  getPaymentCheckoutForCertificates,
  getPaymentCheckout,
  sendCertificatesCodesToEmail,
  sendOrderToEmail,
} = require('./payment.helper');

const {
  newCertificateInputData,
  email,
} = require('../certificate/certificate.variables');
const {
  mockSignatureValue,
  wrongId,
  mockRequestData,
  mockResponseData,
} = require('./payment.variables');
const {
  checkCertificatesPaymentStatus,
} = require('../../modules/payment/payment.service');
const emailService = require('../../modules/email/email.service');

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.utils.js');
jest.mock('../../modules/email/email.service');
jest.mock('../../utils/payment.utils', () => ({
  generatePaymentSignature: () => mockSignatureValue,
}));
jest.mock('../../helpers/payment-controller', () => ({
  paymentController: action => {
    if (action === 'GO_TO_CHECKOUT') {
      return 'https://pay.fondy.eu/merchants/5ad6b888f4becb0c33d543d54e57d86c/default/index.html?token=a28dba98e79aea64ce0d386d53cee087421d406c';
    }
    if (action === 'CHECK_PAYMENT_STATUS') {
      return {
        order_status: 'approved',
        response_signature_string: mockSignatureValue,
        signature: mockSignatureValue,
      };
    }
  },
}));
jest.mock('../../modules/currency/currency.model', () => ({
  findOne: () => ({
    exec: () => ({
      convertOptions: { UAH: { exchangeRate: 1, name: 'UAH' } },
    }),
  }),
}));

let colorId;
let sizeId;
let productId;
let orderId;
let orderData;
let modelId;
let operations;
let materialId;
let categoryId;
let patternId;
let constructorBasicId;
let closureId;
let orderNumber;
let certificateId;
let certificateParams;
let certificates;

describe('Certificate payment queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
    const certificateData = await generateCertificate(
      newCertificateInputData,
      email,
      operations
    );
    certificates = certificateData.certificates;
    certificateId = certificateData.certificates[0]._id;
    certificateParams = { _id: certificateId };
  });
  it('should get Certificate Payment Checkout', async () => {
    const result = await getPaymentCheckoutForCertificates(
      { certificates, currency: 'UAH', amount: '100000', language: 0 },
      operations
    );
    expect(result).toHaveProperty('paymentToken');
  });

  it('should send email with certificates', async () => {
    const result = await sendCertificatesCodesToEmail(
      1,
      certificates,
      operations
    );

    expect(result).toBeDefined();
  });

  afterAll(async () => {
    await deleteCertificate(certificates[0]._id, operations);
  });
});

describe('Payment queries', () => {
  beforeAll(async () => {
    operations = await setupApp();

    const colorData = await createColor(color, operations);
    colorId = colorData._id;
    const categoryData = await createCategory(newCategoryInputData, operations);
    categoryId = categoryData._id;
    const materialData = await createMaterial(getMaterial(colorId), operations);
    materialId = materialData._id;
    const modelData = await createModel(newModel(categoryId), operations);
    modelId = modelData._id;
    sizeId = modelData.sizes[0]._id;
    const patternData = await createPattern(
      queryPatternToAdd(materialId, modelId),
      operations
    );
    patternId = patternData._id;
    const closureData = await createClosure(
      newClosure(materialId, colorId, modelId),
      operations
    );
    closureId = closureData._id;
    const constructorBasicData = await createConstructorBasic(
      newConstructorBasic(materialId, colorId, modelId),
      operations
    );
    constructorBasicId = constructorBasicData._id;

    const productData = await createProduct(
      newProductInputData(
        categoryId,
        modelId,
        materialId,
        materialId,
        colorId,
        patternId,
        closureId,
        sizeId
      ),
      operations
    );
    productId = productData._id;
    orderData = await createOrder(
      newOrderInputData(
        productId,
        modelId,
        sizeId,
        constructorBasicId,
        undefined,
        certificateId
      ),
      operations
    );
    orderId = orderData._id;
    orderNumber = orderData.orderNumber;
  });

  it('should get Payment Checkout', async () => {
    const res = await getPaymentCheckout(
      { orderId, currency: 'UAH', amount: '2' },
      operations
    );
    expect(res).toBeDefined();
    expect(res._id).toBe(orderId);
  });

  it('should get error message ORDER_NOT_VALID when passed wrong orderId', async () => {
    const res = await getPaymentCheckout(
      { orderId: wrongId, currency: 'UAH', amount: '2' },
      operations
    );

    expect(res).toHaveProperty('message', ORDER_NOT_VALID);
  });

  it('should make certificate active when status DECLINED', async () => {
    await paymentService.checkOrderPaymentStatus(
      mockRequestData(orderNumber, PAYMENT_DECLINED, mockSignatureValue),
      mockResponseData
    );

    const certificate = await getCertificateByParams(
      certificateParams,
      operations
    );

    expect(certificate.data.getCertificateByParams).toBeDefined();
  });

  it('should make certificate used when status PAID', async () => {
    await paymentService.checkOrderPaymentStatus(
      mockRequestData(orderNumber, PAYMENT_APPROVED, mockSignatureValue),
      mockResponseData
    );
    const updateResult = await updateCertificate(
      certificateParams,
      USED,
      operations
    );
    const certificate = await getCertificateByParams(
      certificateParams,
      operations
    );
    expect(certificate.errors[0]).toHaveProperty(
      'message',
      CERTIFICATE_IS_USED
    );
    expect(updateResult.dateOfUsing).toBeTruthy();
  });

  it('should send email with order data', async () => {
    const res = await sendOrderToEmail(1, orderNumber, operations);

    expect(res.orderNumber).toBe(orderNumber);
  });

  afterAll(async () => {
    await deleteOrder(orderId, operations);
    await deleteProducts([productId], operations);
    await deleteModel(modelId, operations);
    await deleteConstructorBasic(constructorBasicId, operations);
    await deleteMaterial(materialId, operations);
    await deleteColor(colorId, operations);
    await deleteClosure(closureId, operations);
    await deletePattern(patternId, operations);
    await deleteCategory(categoryId, operations);
    await mongoose.connection.db.dropDatabase();
  });
});

describe('Get payment checkout for certificates test', () => {
  beforeAll(async () => {
    operations = await setupApp();
    const certificateData = await generateCertificate(
      newCertificateInputData,
      email,
      operations
    );
    certificates = certificateData.certificates;
  });

  it('should get payment token', async () => {
    const result = await getPaymentCheckoutForCertificates(
      { certificates, currency: 'USD', amount: '250000', language: 1 },
      operations
    );

    expect(result).toHaveProperty('paymentToken');
  });

  it('should call paymentCheck', async () => {
    emailService.sendEmail = jest.fn();
    const res = { status: jest.fn() };
    const req = mockRequestData(certificates[0].name, PAYMENT_APPROVED);
    await checkCertificatesPaymentStatus(req, res);
    expect(emailService.sendEmail).not.toHaveBeenCalled();
  });

  afterAll(async () => {
    await deleteCertificate(certificates[0]._id, operations);
    await mongoose.connection.db.dropDatabase();
  });
});
