const {
  PRODUCT_ALREADY_EXIST,
  PRODUCT_NOT_FOUND,
} = require('../../error-messages/products.messages');
const {
  badProductId,
  newProductInputData,
  newProductInputDataForUpdate,
} = require('./product.variables');
const {
  createProduct,
  deleteProduct,
  updateProduct,
} = require('../product/product.helper');
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
const { SIZES_TO_CREATE } = require('../size/size.variables');
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
let modelId;
let operations;
let materialId;
let categoryId;
let patternId;
let constructorBasicId;
let closureId;
let productInput;

describe('Order mutations', () => {
  beforeAll(async () => {
    operations = await setupApp();
    const sizeData = await createSize(SIZES_TO_CREATE.size1, operations);
    sizeId = sizeData._id;
    const colorData = await createColor(color, operations);
    colorId = colorData._id;
    const categoryData = await createCategory(newCategoryInputData, operations);
    categoryId = categoryData._id;
    const receivedMaterial = await createMaterial(
      getMaterial(colorId),
      operations
    );
    materialId = receivedMaterial._id;
    const patternData = await createPattern(queryPatternToAdd, operations);
    patternId = patternData._id;
    const closureData = await createClosure(newClosure(materialId), operations);
    closureId = closureData._id;
    const receivedConstructorBasic = await createConstructorBasic(
      newConstructorBasic(materialId, colorId),
      operations
    );
    constructorBasicId = receivedConstructorBasic._id;
    const modelData = await createModel(
      newModel(categoryId, sizeId),
      operations
    );
    modelId = modelData._id;
  });
  test('#1 Should create product', async () => {
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
    const productData = await createProduct(productInput, operations);
    productId = productData._id;

    expect(productData).toBeDefined();
    expect(productData).toHaveProperty('_id', productId);
  });
  test('#2 Should Update Product', async () => {
    const receivedUpdatedProduct = await updateProduct(
      productId,
      newProductInputDataForUpdate(
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
    const res = receivedUpdatedProduct.data.updateProduct;

    expect(res).toBeDefined();
    expect(res).toHaveProperty('name');
    expect(res).toHaveProperty('description');
    expect(res).toHaveProperty('model');
    expect(res).toHaveProperty('category');
  });
  test('#3 Should return Error PRODUCT_NOT_FOUND on updateProduct', async () => {
    const receivedUpdatedProduct = await updateProduct(
      badProductId,
      newProductInputDataForUpdate(
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
    const res = receivedUpdatedProduct.data.updateProduct;

    expect(res).toBeDefined();
    expect(res.message).toBe(PRODUCT_NOT_FOUND);
    expect(res.statusCode).toBe(404);
  });
  test('#4 Should return Error PRODUCT_ALREADY_EXIST', async () => {
    const products = await createProduct(
      newProductInputDataForUpdate(
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

    expect(products).toBeDefined();
    expect(products.message).toBe(PRODUCT_ALREADY_EXIST);
    expect(products.statusCode).toBe(400);
  });
  test('#5 On delete Product with bad id should return error PRODUCT_NOT_FOUND', async () => {
    const receivedData = await deleteProduct(badProductId, operations);
    const res = receivedData.errors[0].message;

    expect(res).toBe(PRODUCT_NOT_FOUND);
  });
  test('#6 Should delete Product and return it`s id', async () => {
    const receivedData = await deleteProduct(productId, operations);
    const res = receivedData.data.deleteProduct._id;

    expect(res).toBe(productId);
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
