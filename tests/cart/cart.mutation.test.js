const {
  CART_MESSAGES: {
    PRODUCT_IS_NOT_EXIST_IN_CART,
    CART_IS_ALREADY_CLEANED,
    CART_IS_NOT_FOUND,
  },
} = require('../../error-messages/cart.messages');
const { SIZES_NOT_FOUND } = require('../../error-messages/size.messages');
const { PATTERN_NOT_FOUND } = require('../../error-messages/pattern.messages');
const { setupApp } = require('../helper-functions');
const {
  addProductToCart,
  removeProductItemsFromCart,
  cleanCart,
  updateCartItemQuantity,
  addConstructorProductItemToCart,
  updateCartConstructorProductItemQuantity,
  mergeCartFromLS,
  changeCartItemSize,
} = require('./cart.helper');
const {
  newConstructorBasic,
} = require('../constructor-basic/constructor-basic.variables');
const {
  newConstructorBottom,
} = require('../constructor-bottom/constructor-bottom.variables');
const {
  newConstructorFront,
} = require('../constructor-front/constructor.variables');
const { newProductInputData } = require('../product/product.variables');
const {
  newProductInCart,
  testQuantity,
  productWrongId,
  sizeWrongId,
  newProductInputData2,
  price,
  expectedPrice,
  allSizes,
  userWrongId,
} = require('./cart.variables');
const { createProduct, deleteProduct } = require('../product/product.helper');
const {
  createConstructorBasic,
  deleteConstructorBasic,
} = require('../constructor-basic/constructor-basic.helper');
const {
  createConstructorBottom,
  deleteConstructorBottom,
} = require('../constructor-bottom/constructor-bottom.helper');
const {
  createConstructorFrontPocket,
  deleteConstructorFrontPocket,
} = require('../constructor-front/constructor.front.helper');
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
const zeroIndex = 0;
let basicId;
let bottomId;
let frontPocketId;
let constructorData;
let constructorWrongData;
let cartFromLS;
let itemId;

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
        sizeId,
      ),
      operations,
    );
    productId2 = productData2._id;
    cartItems2 = newProductInCart(productId2, sizeId);
    items2 = cartItems2.items;
    adminEmail = superAdminUser.email;
    adminPassword = superAdminUser.password;
    const authRes = await loginAdmin(adminEmail, adminPassword, operations);
    adminId = authRes.data.loginAdmin._id;
    value = testQuantity;
    const basicData = await createConstructorBasic(
      newConstructorBasic(materialId, colorId, modelId),
      operations,
    );
    basicId = basicData._id;
    const bottomData = await createConstructorBottom(
      newConstructorBottom(materialId, colorId, modelId),
      operations,
    );
    bottomId = bottomData._id;
    const productSentToCart = await addProductToCart(
      productId,
      adminId,
      sizeId,
      price,
      allSizes,
      operations,
    );
    itemId = productSentToCart.cart.items[0]._id;
    const frontPocketData = await createConstructorFrontPocket(
      newConstructorFront(materialId, colorId, modelId),
      operations,
    );
    frontPocketId = frontPocketData._id;
    constructorWrongData = {
      constructorBasics: basicId,
      constructorBottom: bottomId,
      constructorPattern: '60d593c866a99333c0343a5b',
      constructorFrontPocket: frontPocketId,
    };
    constructorData = {
      constructorBasics: basicId,
      constructorBottom: bottomId,
      constructorPattern: patternId,
      constructorFrontPocket: frontPocketId,
    };
    cartFromLS = [
      {
        product: productId,
        productFromConstructor: constructorData,
        quantity: value,
        options: {
          size: sizeId,
        },
        allSizes,
        price: [
          {
            currency: 'UAH',
            value: 100,
          },
          {
            currency: 'USD',
            value: 5,
          },
        ],
      },
    ];
  });
  it('Should add 2 Products to cart', async () => {
    const productSentToCart2 = await addProductToCart(
      productId2,
      adminId,
      sizeId,
      price,
      allSizes,
      operations,
    );

    expect(productSentToCart2.cart.items).toHaveLength(2);
  });
  it('Should change cart item size', async () => {
    const newSize = sizeId;
    const res = await changeCartItemSize(
      itemId,
      adminId,
      price,
      newSize,
      2,
      operations,
    );

    expect(res.cart.items[0].options.size._id).toBe(newSize);
  });
  it('Should throw error while changing cart item size', async () => {
    const res = await changeCartItemSize(
      itemId,
      userWrongId,
      price,
      sizeId,
      2,
      operations,
    );

    expect(res).toHaveProperty('statusCode', 404);
  });
  it('Should increase product quantity after adding the same Product to cart', async () => {
    const productSentToCart = await addProductToCart(
      productId,
      adminId,
      sizeId,
      price,
      allSizes,
      operations,
    );
    cart = productSentToCart.cart.items[zeroIndex];

    expect(cart.quantity).toBe(2);
  });
  it('Should throw error PATTERN_NOT_FOUND if Pattern is not present', async () => {
    const res = await addConstructorProductItemToCart(
      productId,
      sizeId,
      constructorWrongData,
      adminId,
      operations,
    );

    expect(res).toHaveProperty('message', PATTERN_NOT_FOUND);
  });
  it('Should throw error SIZES_NOT_FOUND while adding wrong size to cart', async () => {
    const res = await addConstructorProductItemToCart(
      productId,
      sizeWrongId,
      constructorData,
      adminId,
      operations,
    );

    expect(res).toHaveProperty('message', SIZES_NOT_FOUND);
  });
  it('Should add Constructor item to cart', async () => {
    const res = await addConstructorProductItemToCart(
      productId,
      sizeId,
      constructorData,
      adminId,
      operations,
    );

    expect(res.cart.items).toHaveLength(3);
  });
  it('Should merge cart from LS', async () => {
    const mergedData = await mergeCartFromLS(cartFromLS, adminId, operations);

    expect(mergedData).toBeDefined();
  });
  it('Should update Cart item quantity', async () => {
    const cartQuantityUpdated = await updateCartItemQuantity(
      items,
      value,
      adminId,
      operations,
    );
    cart = cartQuantityUpdated.cart.items[zeroIndex];

    expect(cart.quantity).toBe(value);
  });
  it('Should calculate price correctly', async () => {
    const res = await updateCartConstructorProductItemQuantity(
      value,
      productId,
      sizeId,
      constructorData,
      adminId,
      operations,
    );

    expect(res.cart.totalPrice[zeroIndex].value).toBe(expectedPrice);
  });
  it('Should throw error in case of wrong removing product from cart', async () => {
    const res = await removeProductItemsFromCart(
      newProductInCart(productWrongId, sizeWrongId).items,
      adminId,
      operations,
    );

    expect(res).toBeDefined();
  });
  it('Should remove Product from cart', async () => {
    const productRemovedfromCart = await removeProductItemsFromCart(
      items,
      adminId,
      operations,
    );

    expect(productRemovedfromCart.cart.items).toHaveLength(2);
  });
  it('Should calculate correct cart quantity after updating product', async () => {
    const cartQuantityUpdated = await updateCartItemQuantity(
      items2,
      value,
      adminId,
      operations,
    );
    cart = cartQuantityUpdated.cart.items[zeroIndex];

    expect(cart.quantity).toBe(value);
  });
  it('Should throw error PRODUCT_IS_NOT_EXIST_IN_CART', async () => {
    value = testQuantity;
    const res = await updateCartItemQuantity(items, value, adminId, operations);

    expect(res).toHaveProperty('statusCode', 400);
    expect(res).toHaveProperty('message', PRODUCT_IS_NOT_EXIST_IN_CART);
  });
  it('Should throw error PRODUCT_IS_NOT_EXIST_IN_CART if there is not Constructor Data', async () => {
    const res = await updateCartConstructorProductItemQuantity(
      value,
      productId,
      sizeId,
      constructorWrongData,
      adminId,
      operations,
    );

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
    await deleteProduct(productId2, operations);
    await deleteModel(modelId, operations);
    await deleteMaterial(materialId, operations);
    await deleteMaterial(materialId, operations);
    await deleteColor(colorId, operations);
    await deleteClosure(closureId, operations);
    await deletePattern(patternId, operations);
    await deleteCategory(categoryId, operations);
    await deleteSize(sizeId, operations);
    await deleteConstructorBasic(basicId, operations);
    await deleteConstructorBottom(bottomId, operations);
    await deleteConstructorFrontPocket(frontPocketId, operations);
  });
});
