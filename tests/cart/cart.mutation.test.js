const {
  CART_MESSAGES: {
    PRODUCT_IS_NOT_EXIST_IN_CART,
    CART_IS_ALREADY_CLEANED,
    CART_IS_NOT_FOUND,
  },
} = require('../../error-messages/cart.messages');
const { SIZES_NOT_FOUND } = require('../../error-messages/size.messages');
const { setupApp } = require('../helper-functions');
const {
  addProductToCart,
  removeProductItemsFromCart,
  cleanCart,
  updateCartItemQuantity,
} = require('./cart.helper');

const { newProductInputData } = require('../product/product.variables');
const {
  newProductInCart,
  testQuantity,
  sizeName,
  productWrongId,
  sizeWrongId,
  newProductInputData2,
} = require('./cart.variables');
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
const { SIZES_TO_CREATE } = require('../size/size.variables');
const { createPattern, deletePattern } = require('../pattern/pattern.helper');
const { queryPatternToAdd } = require('../pattern/pattern.variables');
const { loginAdmin } = require('../user/user.helper');
const { superAdminUser } = require('../user/user.variables');

let operations;
let modelId;
let materialId;
let productId;
let productId2;
let categoryId;
let closureId;
let patternId;
let colorId;
let sizeId;
let adminId;
let cartItems;
let items;
let cartItems2;
let items2;
let value;
let adminEmail;
let adminPassword;
let cart;

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.model.js');
jest.mock('../../modules/currency/currency.utils.js');
jest.mock('../../modules/product/product.utils.js');

describe('Cart queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
    const sizeData = await createSize(SIZES_TO_CREATE.size1, operations);
    sizeId = sizeData._id;
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
    cartItems = newProductInCart(productId, sizeId);
    items = cartItems.items;
    const productData2 = await createProduct(
      newProductInputData2(
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
    productId2 = productData2._id;
    cartItems2 = newProductInCart(productId2, sizeId);
    items2 = cartItems2.items;
    adminEmail = superAdminUser.email;
    adminPassword = superAdminUser.password;
    const authRes = await loginAdmin(adminEmail, adminPassword, operations);
    adminId = authRes.data.loginAdmin._id;
    value = testQuantity;
  });
  it('Should add 2 Products to cart', async () => {
    const productSentToCart = await addProductToCart(
      productId,
      adminId,
      sizeId,
      operations
    );
    cart = productSentToCart.cart.items[0];
    const productSentToCart2 = await addProductToCart(
      productId2,
      adminId,
      sizeId,
      operations
    );
    expect(cart.product._id).toBe(productId);
    expect(cart.options).toHaveProperty('size', {
      _id: sizeId,
      name: sizeName,
    });
    expect(productSentToCart2.cart.items).toHaveLength(2);
  });
  it('Should throw error SIZES_NOT_FOUND while adding Product to cart', async () => {
    const res = await addProductToCart(
      productId,
      adminId,
      sizeWrongId,
      operations
    );
    expect(res).toHaveProperty('message', SIZES_NOT_FOUND);
  });
  it('Should increase product quantity after adding the same Product to cart', async () => {
    const productSentToCart = await addProductToCart(
      productId,
      adminId,
      sizeId,
      operations
    );
    cart = productSentToCart.cart.items[0];

    expect(cart.quantity).toBe(2);
  });
  it('Should update Cart item quantity', async () => {
    const cartQuantityUpdated = await updateCartItemQuantity(
      items,
      value,
      adminId,
      operations
    );
    cart = cartQuantityUpdated.cart.items[0];
    expect(cart.quantity).toBe(value);
  });
  it('Should throw error in case of wrong removing product from cart', async () => {
    const res = await removeProductItemsFromCart(
      newProductInCart(productWrongId, sizeWrongId).items,
      adminId,
      operations
    );
    expect(res).toBeDefined();
  });
  it('Should remove Product from cart', async () => {
    const productRemovedfromCart = await removeProductItemsFromCart(
      items,
      adminId,
      operations
    );

    expect(productRemovedfromCart.cart.items).toHaveLength(1);
  });
  it('Should calculate correct cart quantity after updating product', async () => {
    const cartQuantityUpdated = await updateCartItemQuantity(
      items2,
      value,
      adminId,
      operations
    );
    cart = cartQuantityUpdated.cart.items[0];

    expect(cart.quantity).toBe(value);
  });
  it('Should throw error PRODUCT_IS_NOT_EXIST_IN_CART', async () => {
    value = testQuantity;
    const res = await updateCartItemQuantity(items, value, adminId, operations);

    expect(res).toHaveProperty('statusCode', 400);
    expect(res).toHaveProperty('message', PRODUCT_IS_NOT_EXIST_IN_CART);
  });
  it('Should clean Cart', async () => {
    const cartIsCleant = await cleanCart(adminId, operations);

    expect(cartIsCleant._id).not.toBeNull();
    expect(cartIsCleant._id).toBeDefined();
  });
  it('Should throw error CART_IS_ALREADY_CLEANED', async () => {
    const res = await cleanCart(adminId, operations);

    expect(res).toHaveProperty('statusCode', 400);
    expect(res).toHaveProperty('message', CART_IS_ALREADY_CLEANED);
  });
  it('Should throw error CART_IS_NOT_FOUND', async () => {
    const res = await updateCartItemQuantity(items, value, adminId, operations);
    expect(res).toHaveProperty('statusCode', 404);
    expect(res).toHaveProperty('message', CART_IS_NOT_FOUND);
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
