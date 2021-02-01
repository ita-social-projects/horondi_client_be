/* eslint-disable no-undef */
const {
  PRODUCT_ALREADY_EXIST,
  PRODUCT_NOT_FOUND,
} = require('../../error-messages/products.messages');
const {
  badProductId,
  newProductInputData,
  newProductInputDataForCompare,
  newProductInputDataForUpdate,
} = require('./product.variables');
const {
  newConstructorBasic,
  newPattern,
  newClosure,
  newSizeInputData,
  newModelInputData,
  newCategoryInputData,
  newMaterialInputData,
  newColorInputData,
} = require('../order/order.variables');

const {
  deleteConstructorBasic,
  createConstructorBasicWithData,
} = require('../constructor-basic/constructor-basic.helper');
const { createColor, deleteColor } = require('../color/color.helper');
const {
  testCreateMaterial,
  deleteMaterial,
} = require('../materials/material.helper');
const {
  createCategory,
  deleteCategory,
} = require('../category/category.helper');
const { createClosure, deleteClosure } = require('../closure/closure.helper');
const { createModel, deleteModel } = require('../model/model.helper');
const {
  createProduct,
  deleteProduct,
  getProductById,
  createProductWithData,
  createProductSecond,
  getAllProductsWithSkipAndLimit,
  updateProduct,
} = require('../product/product.helper');
const { createSize, deleteSize } = require('../size/size.helper');
const { createPattern, deletePattern } = require('../pattern/pattern.helper');

const { setupApp } = require('../helper-functions');

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.model.js');
jest.mock('../../modules/currency/currency.utils.js');
jest.mock('../../modules/product/product.utils.js');

let colorId;
let sizeId;
let productId;
let modelId;
let operations;
let materialId;
let categoryId;
let patternId;
let constructorBasicId;
let closureId;
let productInput;
let currentProduct;
let productUpdateInput;
let currentProductUpdated;

describe('Order mutations', () => {
  beforeAll(async () => {
    operations = await setupApp();
    sizeId = await createSize(newSizeInputData, operations);
    colorId = await createColor(newColorInputData, operations);
    categoryId = await createCategory(newCategoryInputData, operations);
    const receivedMaterial = await testCreateMaterial(
      newMaterialInputData(colorId),
      operations
    );
    materialId = receivedMaterial._id;
    patternId = await createPattern(newPattern, operations);
    closureId = await createClosure(newClosure(materialId), operations);
    const receivedConstructorBasic = await createConstructorBasicWithData(
      newConstructorBasic(materialId, colorId),
      operations
    );
    constructorBasicId = receivedConstructorBasic._id;

    modelId = await createModel(
      newModelInputData(categoryId, constructorBasicId, sizeId),
      operations
    );
    productInput = newProductInputData(
      categoryId,
      modelId,
      materialId,
      materialId,
      colorId,
      patternId,
      closureId,
      sizeId
    );
    productUpdateInput = newProductInputDataForUpdate(
      categoryId,
      modelId,
      materialId,
      materialId,
      colorId,
      patternId,
      closureId,
      sizeId
    );
    currentProductUpdated = newProductInputDataForCompare(productUpdateInput);
    currentProduct = newProductInputDataForCompare(productInput);
  });
  afterEach(async () => {
    await deleteProduct(productId, operations);
  });
  test('#1 Should receive all products', async done => {
    productId = await createProduct(productInput, operations);
    const products = await getProductById(productId, operations);
    let res = products.data.getProductById;
    expect(products).toBeDefined();
    expect(res).toEqual({
      ...currentProduct,
      _id: productId,
    });
    done();
  });
  test('#2 Should Update Product', async done => {
    productId = await createProduct(productInput, operations);
    const receivedUpdatedProduct = await updateProduct(
      productId,
      productUpdateInput,
      operations
    );
    const res = receivedUpdatedProduct.data.updateProduct;
    expect(res).toBeDefined();
    expect(res).toEqual({
      ...currentProductUpdated,
      _id: productId,
    });
    done();
  });
  test('#3 Should return Error PRODUCT_NOT_FOUND on updateProduct', async done => {
    const receivedUpdatedProduct = await updateProduct(
      badProductId,
      productUpdateInput,
      operations
    );
    const res = receivedUpdatedProduct.data.updateProduct;
    expect(res).toBeDefined();
    expect(res.message).toBe(PRODUCT_NOT_FOUND);
    expect(res.statusCode).toBe(404);
    done();
  });
  test('#4 Should return Error PRODUCT_ALREADY_EXIST', async done => {
    productId = await createProduct(productInput, operations);
    const products = await createProductSecond(productInput, operations);
    const res = products.data.addProduct;
    expect(res).toBeDefined();
    expect(res.message).toBe(PRODUCT_ALREADY_EXIST);
    expect(res.statusCode).toBe(400);
    done();
  });
  test('#5 On delete Product with bad id should return error PRODUCT_NOT_FOUND', async done => {
    const ReceivedData = await deleteProduct(badProductId, operations);
    const res = ReceivedData.errors[0].message;
    expect(res).toBe(PRODUCT_NOT_FOUND);
    done();
  });
  test('#6 Should delete Product and return it`s id', async done => {
    productId = await createProduct(productInput, operations);
    const ReceivedData = await deleteProduct(productId, operations);
    const res = ReceivedData.data.deleteProduct._id;
    expect(res).toBe(productId);
    done();
  });

  afterAll(async () => {
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
