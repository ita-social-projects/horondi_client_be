const { PRODUCT_NOT_FOUND } = require('../../error-messages/products.messages');
const {
  badProductId,
  newProductInputData,
  newProductInputDataForCompare,
  badCategoryId,
  filterArgs,
  correctFilter,
} = require('./product.variables');
const {
  createProduct,
  deleteProduct,
  getProductById,
  getAllProductsWithSkipAndLimit,
  getAllProductCategoriesForFilter,
  getModelsByCategory,
  getPopularProducts,
  getProductsForWishlist,
  getProductsForCart,
  getFilter,
  getCurrency,
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
const { deleteUser } = require('../user/user.helper');
const { createUser } = require('../helpers/users');
const { testUsersSet } = require('../user/user.variables');
const {
  CATEGORY_NOT_FOUND,
} = require('../../error-messages/category.messages');

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
let userId;

describe('Product queries', () => {
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
    userId = await createUser(operations, testUsersSet[0]);
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
    currentProduct = newProductInputDataForCompare(productInput);
  });

  test('#1 Should receive product by id', async () => {
    const products = await getProductById(productId, operations);
    const res = products.data.getProductById;

    expect(products).toBeDefined();
    expect(res).toHaveProperty('name', currentProduct.name);
    expect(res).toHaveProperty('description', currentProduct.description);
  });
  test('#2 Should Products by filter', async () => {
    const products = await getAllProductsWithSkipAndLimit(0, 0, operations);
    const res = products.data.getProducts;

    expect(res.items).toHaveLength(17);
    expect(res.items).not.toBeNull();
  });
  test('#3 Should return Error PRODUCT_NOT_FOUND', async () => {
    const products = await getProductById(badProductId, operations);
    const res = products.data.getProductById;

    expect(res.message).toBe(PRODUCT_NOT_FOUND);
    expect(res.statusCode).toBe(404);
  });

  test('#4 Should return filter info', async () => {
    const filterOptions = await getAllProductCategoriesForFilter(operations);
    const res = filterOptions.data.getProductsFilters.categories;
    expect(Array.isArray(res)).toBeTruthy();
  });

  test('#5 Should return models', async () => {
    const models = await getModelsByCategory(categoryId, operations);
    const res = models.data.getModelsByCategory;
    expect(res.some(model => model._id === modelId)).toBeTruthy();
  });

  test('#6 Should return popular products', async () => {
    const popularProducts = await getPopularProducts(operations);
    const res = popularProducts.data.getPopularProducts.labels;
    expect(Array.isArray(res)).toBeTruthy();
  });

  test('#7 Should return products from user wishlist', async () => {
    const productsFromWishlist = await getProductsForWishlist(userId);
    expect(Array.isArray(productsFromWishlist)).toBeTruthy();
  });

  test('#8 Should return products from user cart', async () => {
    const productsFromCart = await getProductsForCart(userId);
    expect(Array.isArray(productsFromCart)).toBeTruthy();
  });

  test('#9 Should throw error when category id wrong', async () => {
    const getModelData = await getModelsByCategory(badCategoryId, operations);
    const res = getModelData.data.getModelsByCategory.message;
    expect(res).not.toBe(CATEGORY_NOT_FOUND);
  });

  test('#10 Should return filter', async () => {
    const filter = await getFilter(filterArgs);
    expect(filter).toEqual(correctFilter);
  });

  test('#11 Should return currency', async () => {
    const currencyUA = getCurrency(0, 26, 1);
    const currencyUSD = getCurrency(1, 26, 1);
    const currencyUNDEF = getCurrency(2, 26, 1);

    expect(currencyUA).toBe(26);
    expect(currencyUSD).toBe(1);
    expect(currencyUNDEF).toBe('');
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
    await deleteUser(userId, operations);
  });
});
