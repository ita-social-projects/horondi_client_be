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
const { createSize, deleteSize } = require('../size/size.helper');
const { createPlainSize } = require('../size/size.variables');
const { createPattern, deletePattern } = require('../pattern/pattern.helper');
const { queryPatternToAdd } = require('../pattern/pattern.variables');
const { setupApp } = require('../helper-functions');

const {
  generateCertificate,
  getCertificatesByPaymentToken,
  deleteCertificate,
} = require('../certificate/certificate.helper');

const {
  checkCertificatesPaymentStatus,
  getPaymentCheckoutForCertificates,
  checkOrderPaymentStatus,
  getPaymentCheckout,
  sendCertificatesCodesToEmail,
} = require('./payment.helper');

const {
  newCertificateInputData,
  email,
} = require('../certificate/certificate.variables');

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.model.js');
jest.mock('../../modules/currency/currency.utils.js');
jest.mock('../../modules/product/product.utils.js');

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
let certificates;
let paymentToken;

const wrongId = 'ddfdf34';

describe('Certificate payment queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
    const certificateData = await generateCertificate(
      newCertificateInputData,
      email,
      operations
    );
    certificates = certificateData.certificates;
  });

  it('should get Certificate Payment Checkout', async () => {
    const result = await getPaymentCheckoutForCertificates(
      { certificates, currency: 'UAH', amount: '100000' },
      operations
    );
    paymentToken = result.paymentToken;

    expect(result).toHaveProperty('paymentToken');
  });

  it('should get Certificates by payment token', async () => {
    const result = await getCertificatesByPaymentToken(
      paymentToken,
      operations
    );

    expect(result.paymentStatus).toBe('PROCESSING');
  });

  it('should check Certificates payment status', async () => {
    const result = await checkCertificatesPaymentStatus(
      certificates[0].name,
      paymentToken,
      operations
    );

    expect(result).toBeDefined();
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
    const sizeData = await createSize(
      createPlainSize(modelId).size1,
      operations
    );
    sizeId = sizeData._id;
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
      newOrderInputData(productId, modelId, sizeId, constructorBasicId),
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

  it('should check Order payment status', async () => {
    const res = await checkOrderPaymentStatus(orderNumber, 1, operations);

    expect(res).toBeDefined();
  });

  it('should get null after checking order payment status with wrong id', async () => {
    const res = await checkOrderPaymentStatus(wrongId, 1, operations);

    expect(res.data.checkOrderPaymentStatus).toBe(null);
  });

  afterAll(async () => {
    await deleteOrder(orderId, operations);
    await deleteProducts([productId], operations);
    await deleteModel(modelId, operations);
    await deleteConstructorBasic(constructorBasicId, operations);
    await deleteMaterial(materialId, operations);
    await deleteColor(colorId, operations);
    await deleteSize(sizeId, operations);
    await deleteClosure(closureId, operations);
    await deletePattern(patternId, operations);
    await deleteCategory(categoryId, operations);
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
      { certificates, currency: 'USD', amount: '250000' },
      operations
    );

    expect(result).toHaveProperty('paymentToken');
  });

  afterAll(async () => {
    await deleteCertificate(certificates[0]._id, operations);
  });
});
