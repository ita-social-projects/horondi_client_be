const mongoose = require('mongoose');
const { ORDER_NOT_FOUND } = require('../../error-messages/orders.messages');
const {
  CERTIFICATE_IN_PROGRESS,
} = require('../../error-messages/certificate.messages');
const {
  deleteOrder,
  createOrder,
  updateOrderById,
} = require('./order.helpers');
const {
  getCertificateByParams,
  generateCertificate,
} = require('../certificate/certificate.helper');
const {
  wrongId,
  email,
  newCertificateInputData,
  newOrderInputData,
  newOrderUpdated,
} = require('./order.variables');
const { newProductInputData } = require('../product/product.variables');
const { createProduct, deleteProducts } = require('../product/product.helper');
const {
  deleteConstructorBasic,
  createConstructorBasic,
} = require('../constructor-basic/constructor-basic.helper');
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

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.utils.js');
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
let modelId;
let operations;
let materialId;
let categoryId;
let patternId;
let constructorBasicId;
let closureId;
let certificateId;
let certificateName;
let certificateParams;

describe('Order queries', () => {
  beforeAll(async () => {
    operations = await setupApp();

    const certificateData = await generateCertificate(
      newCertificateInputData,
      email,
      operations
    );
    certificateId = certificateData.certificates[0]._id;
    certificateName = certificateData.certificates[0].name;
    certificateParams = { name: certificateName };

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
  });
  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
  });
  const { status, delivery, paymentStatus, userComment, items, recipient } =
    newOrderInputData(productId, modelId, sizeId, constructorBasicId);

  test('Should create order without certificate', async () => {
    const order = await createOrder(
      newOrderInputData(productId, modelId, sizeId, constructorBasicId),
      operations
    );
    orderId = order._id;

    expect(order).toBeDefined();
    expect(items).toBeInstanceOf(Array);
    expect(order).toHaveProperty('status', status);
    expect(order).toHaveProperty('recipient', recipient);
    expect(order).toHaveProperty('userComment', userComment);
    expect(order).toHaveProperty('paymentStatus', paymentStatus);
    expect(order).toHaveProperty('delivery', delivery);
    expect(order).toHaveProperty('totalItemsPrice');
    expect(order).toHaveProperty('totalPriceToPay');
    expect(order).toHaveProperty('certificateId', '');

    const certificate = await getCertificateByParams(
      certificateParams,
      operations
    );
    expect(certificate.data.getCertificateByParams).toBeDefined();
  });

  test('Should update order without certificate', async () => {
    const updatedOrder = await updateOrderById(
      newOrderUpdated(productId, modelId, sizeId),
      orderId,
      operations
    );

    expect(updatedOrder).toBeTruthy();
    expect(updatedOrder).toHaveProperty('certificateId', '');
  });

  const {
    delivery: updatedDelivery,
    paymentStatus: updatedPaymentStatus,
    userComment: updatedUserComment,
    recipient: updatedUser,
    status: updatedStatus,
    items: updatedItems,
  } = newOrderUpdated(productId, modelId, sizeId, constructorBasicId);

  test('Should update order with certificate', async () => {
    const updatedOrder = await updateOrderById(
      newOrderUpdated(productId, modelId, sizeId, undefined, certificateId),
      orderId,
      operations
    );

    expect(updatedOrder).toBeTruthy();
    expect(updatedItems).toBeInstanceOf(Array);
    expect(updatedOrder).toHaveProperty('status', updatedStatus);
    expect(updatedOrder.recipient).toEqual(updatedUser);
    expect(updatedOrder).toHaveProperty('userComment', updatedUserComment);
    expect(updatedOrder).toHaveProperty('paymentStatus', updatedPaymentStatus);
    expect(updatedOrder.delivery).toEqual(updatedDelivery);
    expect(updatedOrder).toHaveProperty('totalItemsPrice');
    expect(updatedOrder).toHaveProperty('totalPriceToPay');
    expect(updatedOrder).toHaveProperty('certificateId', certificateId);

    const certificate = await getCertificateByParams(
      certificateParams,
      operations
    );
    expect(certificate.data.getCertificateByParams).toBeDefined();
  });

  test('Should create order with certificate', async () => {
    const order = await createOrder(
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

    expect(order).toBeDefined();
    expect(order).toHaveProperty('certificateId', certificateId);

    const certificate = await getCertificateByParams(
      certificateParams,
      operations
    );
    expect(certificate.errors[0]).toHaveProperty(
      'message',
      CERTIFICATE_IN_PROGRESS
    );
  });

  test('Should throw error ORDER_NOT_FOUND after try to update', async () => {
    const { message } = await updateOrderById(
      newOrderUpdated(productId, modelId, sizeId),
      wrongId,
      operations
    );

    expect(message).toBe(ORDER_NOT_FOUND);
  });
  test('Should throw error ORDER_NOT_FOUND after try to delete', async () => {
    const deletedUnexistingOrder = await deleteOrder(wrongId, operations);

    expect(deletedUnexistingOrder.data.deleteOrder).toHaveProperty(
      'message',
      ORDER_NOT_FOUND
    );
  });
  test('Should delete order', async () => {
    const deletedOrder = await deleteOrder(orderId, operations);

    expect(deletedOrder.data.deleteOrder).toHaveProperty('_id', orderId);
  });

  afterAll(async () => {
    await deleteProducts([productId], operations);
    await deleteModel(modelId, operations);
    await deleteConstructorBasic(constructorBasicId, operations);
    await deleteMaterial(materialId, operations);
    await deleteColor(colorId, operations);
    await deleteClosure(closureId, operations);
    await deletePattern(patternId, operations);
    await deleteCategory(categoryId, operations);
  });
});
