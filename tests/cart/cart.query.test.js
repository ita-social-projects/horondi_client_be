const {
  CART_MESSAGES: { CART_IS_NOT_FOUND },
} = require('../../error-messages/cart.messages');
const { WRONG_CREDENTIALS } = require('../../error-messages/user.messages');
const { setupApp } = require('../helper-functions');
const {
  addProductToCart,
  getCartByUserId,
  cleanCart,
} = require('./cart.helper');
const {
  userWrongId, sizeName, price, allSizes,
} = require('./cart.variables');
const { newProductInputData } = require('../product/product.variables');
const { createProduct, deleteProduct } = require('../product/product.helper');
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
const { loginAdmin } = require('../user/user.helper');
const { superAdminUser } = require('../user/user.variables');

let operations;
let modelId;
let materialId;
let productId;
let categoryId;
let closureId;
let patternId;
let colorId;
let sizeId;
let adminId;
let cartItems;
let adminEmail;
let adminPassword;
const zeroIndex = 0;

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.model.js');
jest.mock('../../modules/currency/currency.utils.js');
jest.mock('../../modules/product/product.utils.js');

describe('Cart queries', () => {
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
      operations,
    );
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
    adminEmail = superAdminUser.email;
    adminPassword = superAdminUser.password;
    const authRes = await loginAdmin(adminEmail, adminPassword, operations);
    adminId = authRes.data.loginAdmin._id;
    await addProductToCart(
      productId,
      adminId,
      sizeId,
      price,
      allSizes,
      operations,
    );
  });

  it('should return cart by user id', async () => {
    const res = await getCartByUserId(adminId, operations);
    cartItems = res.cart.items[zeroIndex];

    expect(cartItems).toBeDefined();
    expect(cartItems.product._id).toBe(productId);
    expect(cartItems.options).toHaveProperty('size', {
      _id: sizeId,
      name: sizeName,
    });
  });

  it('Should throw error CART_IS_NOT_FOUND', async () => {
    await cleanCart(adminId, operations);
    const res = await getCartByUserId(adminId, operations);

    expect(res).toBeDefined();
    expect(res).toHaveProperty('statusCode', 404);
    expect(res).toHaveProperty('message', CART_IS_NOT_FOUND);
  });
  it('Should throw error WRONG_CREDENTIALS', async () => {
    const res = await getCartByUserId(userWrongId, operations);

    expect(res).toBeDefined();
    expect(res).toHaveProperty('statusCode', 401);
    expect(res).toHaveProperty('message', WRONG_CREDENTIALS);
  });
  afterAll(async () => {
    await deleteProduct(productId, operations);
    await deleteModel(modelId, operations);
    await deleteMaterial(materialId, operations);
    await deleteMaterial(materialId, operations);
    await deleteColor(colorId, operations);
    await deleteClosure(closureId, operations);
    await deletePattern(patternId, operations);
    await deleteCategory(categoryId, operations);
    await deleteSize(sizeId, operations);
  });
});
