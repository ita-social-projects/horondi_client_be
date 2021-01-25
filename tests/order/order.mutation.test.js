/* eslint-disable no-undef */
const { ORDER_NOT_FOUND } = require('../../error-messages/orders.messages');
const {
  newConstructorBasic,
  newPattern,
  newClosure,
  newOrderInputData,
  newSizeInputData,
  newProductInputData,
  newModelInputData,
  newCategoryInputData,
  newMaterialInputData,
  newColorInputData,
  newOrderUpdated,
  wrongId,
} = require('./order.variables');
const {
  createOrder,
  deleteOrder,
  updateOrderById,
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
jest.mock('../../modules/delivery/nova-poshta/nova-poshta.service.js');
jest.mock('../../modules/currency/currency.utils.js');
jest.mock('../../modules/delivery/delivery.service.js');
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

describe('Order mutations', () => {
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
      newModelInputData(categoryId, constructorBasicId, sizeId),
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
  });
  const {
    status,
    delivery,
    paymentStatus,
    userComment,
    items,
    user,
  } = newOrderInputData(productId, modelId, sizeId, constructorBasicId);

  test('Should create order', async () => {
    const order = await createOrder(
      newOrderInputData(productId, modelId, sizeId, constructorBasicId),
      operations
    );
    orderId = order._id;
    expect(order).toBeDefined();
    expect(items).toBeInstanceOf(Array);
    expect(order).toHaveProperty('status', status);
    expect(order).toHaveProperty('user', user);
    expect(order).toHaveProperty('userComment', userComment);
    expect(order).toHaveProperty('paymentStatus', paymentStatus);
    expect(order).toHaveProperty('delivery', delivery);
    expect(order).toHaveProperty('totalItemsPrice');
    expect(order).toHaveProperty('totalPriceToPay');
  });
  const {
    delivery: updatedDelivery,
    paymentStatus: updatedPaymentStatus,
    userComment: updatedUserComment,
    user: updatedUser,
    status: updatedStatus,
  } = newOrderUpdated(productId, modelId, sizeId, constructorBasicId);
  test('Should update order', async () => {
    const updatedOrder = await updateOrderById(
      newOrderUpdated(productId, modelId, sizeId),
      orderId,
      operations
    );

    expect(updatedOrder).toBeTruthy();
    expect(updatedOrder).toHaveProperty('status', updatedStatus);
    expect(updatedOrder.user).toEqual(updatedUser);
    expect(updatedOrder).toHaveProperty('userComment', updatedUserComment);
    expect(updatedOrder).toHaveProperty('paymentStatus', updatedPaymentStatus);
    expect(updatedOrder.delivery).toEqual(updatedDelivery);
    expect(updatedOrder).toHaveProperty('totalItemsPrice');
    expect(updatedOrder).toHaveProperty('totalPriceToPay');
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
    const { errors } = await deleteOrder(wrongId, operations);
    expect(errors[0].message).toEqual(ORDER_NOT_FOUND);
  });
  test('Should delete order', async () => {
    const deletedOrder = await deleteOrder(orderId, operations);

    expect(deletedOrder.data.deleteOrder).toHaveProperty('_id', orderId);
  });
  afterAll(async () => {
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
