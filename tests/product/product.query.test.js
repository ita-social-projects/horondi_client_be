/* eslint-disable no-undef */
const { PRODUCT_NOT_FOUND } = require('../../error-messages/products.messages');
const {
  badProductId,
  newProductInputData,
  newProductInputDataForCompare,
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
    productId = await createProduct(productInput, operations);
    currentProduct = newProductInputDataForCompare(productInput);
  });
  test('#1 Should receive all products', async done => {
    const products = await getProductById(productId, operations);
    let res = products.data.getProductById;
    expect(products).toBeDefined();
    expect(res).toEqual({
      ...currentProduct,
      _id: productId,
    });
    done();
  });

  test('#2 Should Products by filter', async done => {
    const products = await getAllProductsWithSkipAndLimit(0, 0, operations);
    const res = products.data.getProducts;
    expect(res.items).toHaveLength(1);
    expect(res.items).not.toBeNull();
    done();
  });
  test('#3 Should return Error PRODUCT_NOT_FOUND', async done => {
    const products = await getProductById(badProductId, operations);
    const res = products.data.getProductById;
    expect(res.message).toBe(PRODUCT_NOT_FOUND);
    expect(res.statusCode).toBe(404);
    done();
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
