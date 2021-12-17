const { deleteOrder, createOrder } = require('../order/order.helpers');
const { getPaymentCheckout } = require('./payment.helper');
const { checkPaymentStatus } = require('../../modules/payment/payment.service');
const { wrongId, newOrderInputData } = require('../order/order.variables');
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
const { createPlainSize } = require('../size/size.variables');
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
let orderData;
let modelId;
let operations;
let materialId;
let categoryId;
let patternId;
let constructorBasicId;
let closureId;
let mockResponse;

describe('Payment queries', () => {
  beforeAll(async () => {
    operations = await setupApp();

    mockResponse = () => {
      const res = {};
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      return res;
    };

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
      operations,
    );
    sizeId = sizeData._id;
    const patternData = await createPattern(
      queryPatternToAdd(materialId, modelId),
      operations,
    );
    patternId = patternData._id;
    const closureData = await createClosure(
      newClosure(materialId, colorId, modelId),
      operations,
    );
    closureId = closureData._id;
    const constructorBasicData = await createConstructorBasic(
      newConstructorBasic(materialId, colorId, modelId),
      operations,
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
        sizeId,
      ),
      operations,
    );
    productId = productData._id;
    orderData = await createOrder(
      newOrderInputData(productId, modelId, sizeId, constructorBasicId),
      operations,
    );
    orderId = orderData._id;
  });

  it('should get Payment Checkout', async () => {
    const res = await getPaymentCheckout(
      { orderId, currency: 'UAH', amount: '2' },
      1,
      operations,
    );
    expect(res).toBeDefined();
    expect(res.data.getPaymentCheckout._id).toBe(orderId);
  });

  it('should obtain response from checkPaymentStatus', async () => {
    const req = { body: { order_id: `${wrongId}` } };
    const res = mockResponse();
    await checkPaymentStatus(req, res);

    expect(res).toBeDefined();
    expect(res).toBeInstanceOf(Object);
  });

  afterAll(async () => {
    await deleteOrder(orderId, operations);
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
