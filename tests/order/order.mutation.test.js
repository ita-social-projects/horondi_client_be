const { ORDER_NOT_FOUND } = require('../../error-messages/orders.messages');
const {
  deleteOrder,
  createOrder,
  updateOrderById,
} = require('./order.helpers');
const {
  wrongId,
  newOrderInputData,
  newOrderUpdated,
} = require('./order.variables');
const { newProductInputData } = require('../product/product.variables');
const { createProduct, deleteProduct } = require('../product/product.helper');
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
const { createSize, deleteSize } = require('../size/size.helper');
const { SIZES_TO_CREATE, createPlainSize } = require('../size/size.variables');
const { createPattern, deletePattern } = require('../pattern/pattern.helper');
const { queryPatternToAdd } = require('../pattern/pattern.variables');
const { setupApp } = require('../helper-functions');

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.model.js');
jest.mock('../../modules/currency/currency.utils.js');
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

    const colorData = await createColor(color, operations);
    colorId = colorData._id;
    const categoryData = await createCategory(newCategoryInputData, operations);
    categoryId = categoryData._id;
    const materialData = await createMaterial(getMaterial(colorId), operations);
    materialId = materialData._id;
    const modelData = await createModel(
      newModel(categoryId, sizeId),
      operations
    );
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
