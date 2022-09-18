const {
  deleteOrder,
  createOrder,
  getOrderById,
  getOrdersByUser,
  getAllOrders,
  getPaidOrdersStatistic,
  getOrdersStatistic,
  getUserOrders,
} = require('./order.helpers');
const { generateCertificate, getCertificateByParams } = require('../certificate/certificate.helper');
const { CERTIFICATE_IN_PROGRESS } = require('../../error-messages/certificate.messages')
const {
  wrongId,
  email,
  newCertificateInputData,
  newOrderInputData,
  getOrdersInput,
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
const { superAdminUser } = require('../user/user.variables');
const { loginAdmin } = require('../user/user.helper');

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.utils.js');
jest.mock('../../modules/product/product.utils.js');
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
let userId;
let certificateId;
let certificateName;
let certificateParams;

const date = { dateFrom: '', dateTo: '' };

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

    const {
      data: {
        loginAdmin: { _id },
      },
    } = await loginAdmin(
      superAdminUser.email,
      superAdminUser.password,
      operations
    );
    userId = _id;

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
    date.dateFrom = new Date();
    const orderData = await createOrder(
      newOrderInputData(productId, modelId, sizeId, constructorBasicId, userId, certificateId),
      operations
    );
    date.dateTo = new Date();
    orderId = orderData._id;
    userId = orderData.user_id;
  });

  const { recipient, userComment, delivery, paymentStatus, status } =
    newOrderInputData(productId, modelId, sizeId, constructorBasicId);

  test('Should receive all orders', async () => {
    const { filter, sort } = getOrdersInput;
    const orders = await getAllOrders(filter, sort, operations);

    expect(orders).toBeDefined();
    expect(orders.length).toBeGreaterThan(0);
    expect(orders).toBeInstanceOf(Array);
    expect(orders[0]).toHaveProperty('recipient', recipient);
    expect(orders[0]).toHaveProperty('certificateId', certificateId);

    const certificate = await getCertificateByParams(certificateParams, operations)
    expect(certificate.errors[0]).toHaveProperty('message', CERTIFICATE_IN_PROGRESS);
  });

  test('Should receive user orders', async () => {
    const response = await getUserOrders(operations);
    const orders = response.userOrders;

    expect(orders).toBeDefined();
    expect(orders[0]).toHaveProperty('recipient', recipient);
    expect(orders[0]).toHaveProperty('paymentStatus', paymentStatus);
    expect(orders[0]).toHaveProperty('status', status);
  });

  test('Should receive paid order statistics', async () => {
    const statistics = await getPaidOrdersStatistic(operations);

    expect(statistics).toBeDefined();
    expect(statistics.counts.length).toBe(0);
    expect(statistics.total).toBe(0);
  });

  test('Should receive order statistics', async () => {
    const statistics = await getOrdersStatistic(operations);

    expect(statistics).toBeDefined();
    expect(statistics.counts.length).toBe(1);
    expect(statistics.names[0]).toBe(status);
  });

  test('Should receive all orders, (without sort option)', async () => {
    const { filter } = getOrdersInput;
    const orders = await getAllOrders(filter, {}, operations);

    expect(orders).toBeDefined();
    expect(orders.length).toBeGreaterThan(0);
    expect(orders).toBeInstanceOf(Array);
    expect(orders[0]).toHaveProperty('recipient', recipient);
  });

  test('Should receive all orders, (with filter.status option)', async () => {
    const { filter, sort } = getOrdersInput;
    const orders = await getAllOrders({ ...filter, status }, sort, operations);

    expect(orders).toBeDefined();
    expect(orders.length).toBeGreaterThan(0);
    expect(orders).toBeInstanceOf(Array);
    expect(orders[0]).toHaveProperty('recipient', recipient);
  });

  test('Should receive all orders, (with filter.paymentStatus option)', async () => {
    const { filter, sort } = getOrdersInput;
    const orders = await getAllOrders(
      { ...filter, paymentStatus },
      sort,
      operations
    );

    expect(orders).toBeDefined();
    expect(orders.length).toBeGreaterThan(0);
    expect(orders).toBeInstanceOf(Array);
    expect(orders[0]).toHaveProperty('recipient', recipient);
  });

  test('Should receive all orders, (with filter.date option)', async () => {
    const { filter, sort } = getOrdersInput;
    const orders = await getAllOrders({ ...filter, date }, sort, operations);

    expect(orders).toBeDefined();
    expect(orders.length).toBeGreaterThan(0);
    expect(orders).toBeInstanceOf(Array);
    expect(orders[0]).toHaveProperty('recipient', recipient);
  });

  test('Should receive all orders by user_id', async () => {
    const { filter, sort } = getOrdersInput;
    const orders = await getOrdersByUser(filter, sort, userId, operations);

    expect(orders).toBeDefined();
    expect(orders[0]).toHaveProperty('recipient', recipient);
    expect(orders[0]).toHaveProperty('paymentStatus', paymentStatus);
    expect(orders[0]).toHaveProperty('status', status);
  });

  test('Should receive all orders by user_id (without sort option)', async () => {
    const { filter } = getOrdersInput;
    const orders = await getOrdersByUser(filter, {}, userId, operations);

    expect(orders).toBeDefined();
    expect(orders[0]).toHaveProperty('recipient', recipient);
    expect(orders[0]).toHaveProperty('paymentStatus', paymentStatus);
    expect(orders[0]).toHaveProperty('status', status);
  });

  test('Should receive all orders by user_id (with filter.status option)', async () => {
    const { filter, sort } = getOrdersInput;
    const orders = await getOrdersByUser(
      { ...filter, status: [status] },
      sort,
      userId,
      operations
    );

    expect(orders).toBeDefined();
    expect(orders[0]).toHaveProperty('recipient', recipient);
    expect(orders[0]).toHaveProperty('paymentStatus', paymentStatus);
    expect(orders[0]).toHaveProperty('status', status);
  });

  test('Should receive all orders by user_id (with filter.paymentStatus option)', async () => {
    const { filter, sort } = getOrdersInput;
    const orders = await getOrdersByUser(
      { ...filter, paymentStatus: [paymentStatus] },
      sort,
      userId,
      operations
    );

    expect(orders).toBeDefined();
    expect(orders[0]).toHaveProperty('recipient', recipient);
    expect(orders[0]).toHaveProperty('paymentStatus', paymentStatus);
    expect(orders[0]).toHaveProperty('status', status);
  });

  test('Should receive all orders by user_id (with filter.date option)', async () => {
    const { filter, sort } = getOrdersInput;
    const orders = await getOrdersByUser(
      { ...filter, date },
      sort,
      userId,
      operations
    );

    expect(orders).toBeDefined();
    expect(orders[0]).toHaveProperty('recipient', recipient);
    expect(orders[0]).toHaveProperty('paymentStatus', paymentStatus);
    expect(orders[0]).toHaveProperty('status', status);
  });

  test('should receive order by id', async () => {
    const {
      data: { getOrderById: order },
    } = await getOrderById(orderId, operations);

    expect(order).toBeDefined();
    expect(order).toBeTruthy();
    expect(order.items).toBeInstanceOf(Array);
    expect(order).toHaveProperty('userComment', userComment);
    expect(order).toHaveProperty('delivery', delivery);
    expect(order).toHaveProperty('paymentStatus', paymentStatus);
    expect(order).toHaveProperty('status', status);
  });

  test('Should throw error ORDER_NOT_FOUND', async () => {
    const res = await getOrderById(wrongId, operations);

    expect(res.data.getOrderById.message).toBe('ORDER_NOT_FOUND');
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
  });
});
