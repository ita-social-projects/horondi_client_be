const {
  PRODUCT_ALREADY_EXIST,
  PRODUCT_NOT_FOUND,
} = require('../../error-messages/products.messages');
const {
  badProductId,
  newProductInputData,
  newProductInputDataForUpdate,
  productUploadedImages,
} = require('./product.variables');
const {
  createProduct,
  deleteProducts,
  updateProduct,
  deleteProductImages,
  uploadProductImages,
} = require('./product.helper');
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
let modelId;
let operations;
let materialId;
let categoryId;
let patternId;
let constructorBasicId;
let closureId;
let productInput;

describe('Product mutations', () => {
  beforeAll(async () => {
    operations = await setupApp();

    const colorData = await createColor(color, operations);
    colorId = colorData._id;
    const categoryData = await createCategory(newCategoryInputData, operations);
    categoryId = categoryData._id;
    const receivedMaterial = await createMaterial(
      getMaterial(colorId),
      operations
    );
    materialId = receivedMaterial._id;
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
    const receivedConstructorBasic = await createConstructorBasic(
      newConstructorBasic(materialId, colorId, modelId),
      operations
    );
    constructorBasicId = receivedConstructorBasic._id;
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
  test('#2.1 Should Update Product With File', async () => {
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
      {},
      [
        {
          large: 'largeXL_0_test-file',
          medium: 'mediumXL_0_test-file',
          small: 'smallXL_0_test-file',
          thumbnail: 'thumbnailXL_0_test-file',
        },
      ],
      operations
    );
    const res = receivedUpdatedProduct.data.updateProduct;

    expect(res).toBeDefined();
    expect(res).toHaveProperty('name');
    expect(res).toHaveProperty('description');
    expect(res).toHaveProperty('model');
    expect(res).toHaveProperty('category');
  });

  test('#2.2 Should Update Product Without File', async () => {
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
      productUploadedImages.primary,
      [],
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
      productUploadedImages.primary,
      [
        {
          large: 'largeXL_0_test-file',
          medium: 'mediumXL_0_test-file',
          small: 'smallXL_0_test-file',
          thumbnail: 'thumbnailXL_0_test-file',
        },
      ],
      operations
    );
    const res = receivedUpdatedProduct.data.updateProduct;

    expect(res).toBeDefined();
    expect(res.message).toBe(PRODUCT_NOT_FOUND);
    expect(res.statusCode).toBe(403);
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
    const receivedData = await deleteProducts([badProductId], operations);

    expect(receivedData.data.deleteProducts).toHaveProperty(
      'message',
      PRODUCT_NOT_FOUND
    );
  });

  test('#6 Should add Product images', async () => {
    const receivedData = await uploadProductImages();

    expect(uploadProductImages).toBeDefined();
    expect(receivedData.primary).toBeDefined();
    expect(receivedData.additional).toBeDefined();
    expect(receivedData).toEqual(productUploadedImages);
  });

  test('#7 Should delete Product images', async () => {
    const receivedData = await deleteProductImages(productId, operations);
    const res = receivedData.data.deleteImages.primary;

    expect(res).toBeDefined();
  });

  test('#8 Should delete Product and return it`s id', async () => {
    const receivedData = await deleteProducts([productId], operations);
    const res = receivedData.data.deleteProducts.items[0]._id;

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
