const {
  COMMENT_NOT_FOUND,
  COMMENT_FOR_NOT_EXISTING_PRODUCT,
  COMMENT_FOR_NOT_EXISTING_USER,
  RATE_FOR_NOT_EXISTING_PRODUCT,
} = require('../../error-messages/comment.messages');
const { setupApp } = require('../helper-functions');
const {
  newComment,
  commentWrongId,
  userWrongId,
  productWrongId,
  updatedComment,
  rate,
  updatedRate,
} = require('./comment.variables');
const {
  deleteComment,
  addComment,
  updateComment,
  addRate,
} = require('./comment.helper');
const { newProductInputData } = require('../product/product.variables');
const {
  createProduct,
  deleteProduct,
  getProductById,
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
const { registerUser, deleteUser, loginUser } = require('../user/user.helper');
const { testUser } = require('../user/user.variables');
const { queryPatternToAdd } = require('../pattern/pattern.variables');

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.model.js');
jest.mock('../../modules/currency/currency.utils.js');
jest.mock('../../modules/product/product.utils.js');
jest.mock('../../modules/currency/currency.utils.js');

let commentId;
let operations;
let modelId;
let materialId;
let productId;
let categoryId;
let closureId;
let patternId;
let constructorBasicId;
let colorId;
let sizeId;
let productRate;
let productRateCount;
let productUserRates;

describe('Comment queries', () => {
  beforeAll(async done => {
    operations = await setupApp();
    const { firstName, lastName, email, pass, language } = testUser;
    const sizeData = await createSize(SIZES_TO_CREATE.size1, operations);
    sizeId = sizeData._id;
    const colorData = await createColor(color, operations);
    colorId = colorData._id;
    const categoryData = await createCategory(newCategoryInputData, operations);
    categoryId = categoryData._id;
    const materialData = await createMaterial(getMaterial(colorId), operations);
    materialId = materialData._id;
    const patternData = await createPattern(queryPatternToAdd, operations);
    patternId = patternData._id;
    const closureData = await createClosure(newClosure(materialId), operations);
    closureId = closureData._id;
    const constructorBasicData = await createConstructorBasic(
      newConstructorBasic(materialId, colorId),
      operations
    );
    constructorBasicId = constructorBasicData._id;
    const modelData = await createModel(
      newModel(categoryId, sizeId),
      operations
    );
    modelId = modelData._id;
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
    const res = await getProductById(productId, operations);
    const receivedProduct = res.data.getProductById;
    productRate = receivedProduct.rate;
    productRateCount = receivedProduct.rateCount;
    productUserRates = receivedProduct.userRates;
    const userData = await registerUser(
      firstName,
      lastName,
      email,
      pass,
      language,
      operations
    );
    const authRes = await loginUser(email, pass, operations);
    userId = authRes.data.loginUser._id;
    done();
  });

  it(' should add a new comment', async done => {
    const receivedComment = await addComment(
      productId,
      newComment(userId),
      operations
    );
    commentId = receivedComment._id;

    expect(receivedComment).not.toBeNull();
    expect(receivedComment).toBeDefined();
    expect(receivedComment).toHaveProperty('product', { _id: productId });
    expect(receivedComment).toHaveProperty('text', newComment(userId).text);
    expect(receivedComment).toHaveProperty('user', { _id: userId });
    expect(receivedComment).toHaveProperty('show', newComment(userId).show);
    done();
  });
  it(' should return error if to add comment to not existing product', async done => {
    const receivedComment = await addComment(
      productWrongId,
      newComment(userId),
      operations
    );

    expect(receivedComment).not.toBeNull();
    expect(receivedComment).toBeDefined();
    expect(receivedComment).toHaveProperty(
      'message',
      COMMENT_FOR_NOT_EXISTING_PRODUCT
    );
    expect(receivedComment).toHaveProperty('statusCode', 404);
    done();
  });
  it('should update comment', async done => {
    const receivedComment = await updateComment(
      commentId,
      updatedComment,
      operations
    );

    expect(receivedComment).not.toBeNull();
    expect(receivedComment).toBeDefined();
    expect(receivedComment).toHaveProperty('text', updatedComment.text);
    expect(receivedComment).toHaveProperty('show', updatedComment.show);
    expect(receivedComment).toHaveProperty('user', { _id: userId });
    expect(receivedComment).toHaveProperty('product', { _id: productId });
    done();
  });
  it(' should return error if id of comment to update is not correct', async done => {
    const receivedComment = await updateComment(
      commentWrongId,
      updatedComment,
      operations
    );

    expect(receivedComment).not.toBeNull();
    expect(receivedComment).toBeDefined();
    expect(receivedComment).toHaveProperty('message', COMMENT_NOT_FOUND);
    expect(receivedComment).toHaveProperty('statusCode', 404);
    done();
  });
  it('should add rate to the product', async done => {
    const receivedComment = await addRate(productId, rate, operations);

    expect(receivedComment).toMatchSnapshot();
    expect(receivedComment).not.toBeNull();
    expect(receivedComment).toBeDefined();
    expect(receivedComment).toHaveProperty('rate', rate);
    expect(receivedComment).toHaveProperty('rateCount', 1);
    expect(receivedComment.userRates.length).toEqual(1);
    done();
  });
  it('should update rate of the product', async done => {
    const receivedComment = await addRate(productId, updatedRate, operations);

    expect(receivedComment).toMatchSnapshot();
    expect(receivedComment).not.toBeNull();
    expect(receivedComment).toBeDefined();
    expect(receivedComment).toHaveProperty('rate', updatedRate);
    expect(receivedComment).toHaveProperty('rateCount', 1);
    expect(receivedComment.userRates.length).toEqual(1);
    done();
  });
  it('should return error if to add rate to not existing product', async done => {
    const receivedComment = await addRate(productWrongId, rate, operations);

    expect(receivedComment).toMatchSnapshot();
    expect(receivedComment).not.toBeNull();
    expect(receivedComment).toBeDefined();
    expect(receivedComment).toHaveProperty(
      'message',
      RATE_FOR_NOT_EXISTING_PRODUCT
    );
    expect(receivedComment).toHaveProperty('statusCode', 404);
    done();
  });

  afterAll(async done => {
    await deleteComment(commentId, operations);
    await deleteUser(userId, operations);
    await deleteProduct(productId, operations);
    await deleteModel(modelId, operations);
    await deleteConstructorBasic(constructorBasicId, operations);
    await deleteMaterial(materialId, operations);
    await deleteColor(colorId, operations);
    await deleteClosure(closureId, operations);
    await deletePattern(patternId, operations);
    await deleteCategory(categoryId, operations);
    await deleteSize(sizeId, operations);
    done();
  });
});
