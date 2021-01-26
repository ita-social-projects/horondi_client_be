/* eslint-disable no-undef */
const { ORDER_NOT_FOUND } = require('../../error-messages/orders.messages');
const {
  newCategoryInputData,
  newOrderInputData,
  newColorInputData,
  newMaterialInputData,
  newModelInputData,
  newProductInputData,
  newSizeInputData,
  newClosure,
  newPattern,
  newConstructorBasic,
  wrongId,
} = require('./order.variables');

const {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderById,
} = require('./order.helpers');
const {
  deleteConstructorBasic,
  createConstructorBasic,
} = require('../constructor-basic/constructor-basic.helper');
const { createColor, deleteColor } = require('../color/color.helper');
const {
  createMaterial,
  deleteMaterial,
} = require('../materials/material.helper');
const {
  createCategory,
  deleteCategory,
} = require('../category/category.helper');
const { createClosure, deleteClosure } = require('../closure/closure.helper');
const { createModel, deleteModel } = require('../model/model.helper');
const { createProduct, deleteProduct } = require('../product/product.helper');
const { createSize, deleteSize } = require('../size/size.helper');
const { createPattern, deletePattern } = require('../pattern/pattern.helper');
const { setupApp } = require('../helper-functions');

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.model.js');
c;
jest.mock('../../modules/product/product.utils.js');

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

describe('Order queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
    sizeId = await createSize(newSizeInputData, operations);
    colorId = await createColor(newColorInputData, operations);
    categoryId = await createCategory(newCategoryInputData, operations);
    materialId = await createMaterial(
      newMaterialInputData(colorId),
      operations
    );
    patternId = await createPattern(newPattern, operations);
    closureId = await createClosure(newClosure(materialId), operations);
    constructorBasicId = await createConstructorBasic(
      newConstructorBasic(materialId, colorId),
      operations
    );
    modelId = await createModel(
      newModelInputData(categoryId, constructorBasicId),
      operations
    );
    productId = await createProduct(
      newProductInputData(
        categoryId,
        modelId,
        materialId,
        materialId,
        colorId,
        patternId,
        closureId
      ),
      operations
    );
    orderId = await createOrder(
      newOrderInputData(productId, modelId, sizeId, constructorBasicId),
      operations
    );
  });

  const {
    user,
    userComment,
    delivery,
    paymentStatus,
    status,
  } = newOrderInputData(productId, modelId, sizeId, constructorBasicId);

  test('Should receive all orders', async () => {
    const orders = await getAllOrders(operations);
    expect(orders).toBeDefined();
    expect(orders.length).toBeGreaterThan(0);
    expect(orders).toBeInstanceOf(Array);
    expect(orders[0]).toHaveProperty('user', user);
  });
  test('should receive order by id', async () => {
    const {
      data: { getOrderById: order },
    } = await getOrderById(orderId._id, operations);

    expect(order).toBeDefined();
    expect(order).toBeTruthy();
    expect(order.items).toBeInstanceOf(Array);
    expect(order).toHaveProperty('userComment', userComment);
    expect(order).toHaveProperty('delivery', delivery);
    expect(order).toHaveProperty('paymentStatus', paymentStatus);
    expect(order).toHaveProperty('status', status);
  });
  test('Should throw error ORDER_NOT_FOUND', async () => {
    const { errors } = await getOrderById(wrongId, operations);
    expect(errors[0].message).toEqual(ORDER_NOT_FOUND);
  });
  afterAll(async () => {
    await deleteOrder(orderId._id, operations);
    await deleteProduct(productId, operations);
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
