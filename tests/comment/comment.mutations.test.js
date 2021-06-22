const {
  COMMENT_NOT_FOUND,
  COMMENT_FOR_NOT_EXISTING_PRODUCT,
  RATE_FOR_NOT_EXISTING_PRODUCT,
  REPLY_COMMENT_IS_NOT_PRESENT,
} = require('../../error-messages/comment.messages');
const { setupApp } = require('../helper-functions');
const {
  newComment,
  commentWrongId,
  productWrongId,
  updatedComment,
  rate,
  updatedRate,
  newOrderInputData,
  newReplyComment,
  updatedReplyComment,
} = require('./comment.variables');
const {
  deleteComment,
  addComment,
  updateComment,
  addRate,
  addReplyComment,
  deleteReplyComment,
  updateReplyComment,
} = require('./comment.helper');
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
const { SIZES_TO_CREATE } = require('../size/size.variables');
const { createPattern, deletePattern } = require('../pattern/pattern.helper');
const { loginAdmin } = require('../user/user.helper');
const { superAdminUser } = require('../user/user.variables');
const { queryPatternToAdd } = require('../pattern/pattern.variables');
const { deleteOrder, createOrder } = require('../order/order.helpers');

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.model.js');
jest.mock('../../modules/currency/currency.utils.js');
jest.mock('../../modules/product/product.utils.js');
jest.mock('../../modules/currency/currency.utils.js');
jest.setTimeout(10000);

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
let adminId;
let orderId;
let replyId;

describe('Comment queries', () => {
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
    const constructorBasicData = await createConstructorBasic(
      newConstructorBasic(materialId, colorId, modelId),
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
  });

  it('should add a new comment', async () => {
    const authRes = await loginAdmin(
      superAdminUser.email,
      superAdminUser.password,
      operations
    );
    adminId = authRes.data.loginAdmin._id;
    const receivedComment = await addComment(
      productId,
      newComment(adminId),
      operations
    );
    commentId = receivedComment._id;

    expect(receivedComment).not.toBeNull();
    expect(receivedComment).toBeDefined();
    expect(receivedComment).toHaveProperty('product', { _id: productId });
    expect(receivedComment).toHaveProperty('text', newComment(adminId).text);
    expect(receivedComment).toHaveProperty('user', { _id: adminId });
    expect(receivedComment).toHaveProperty('show', newComment(adminId).show);
    expect(receivedComment).toHaveProperty('isSelled', false);
  });
  it('should return error if to add comment to not existing product', async () => {
    const receivedComment = await addComment(
      productWrongId,
      newComment(adminId),
      operations
    );

    expect(receivedComment).not.toBeNull();
    expect(receivedComment).toBeDefined();
    expect(receivedComment).toHaveProperty(
      'message',
      COMMENT_FOR_NOT_EXISTING_PRODUCT
    );
    expect(receivedComment).toHaveProperty('statusCode', 404);
  });
  it('should update comment', async () => {
    const receivedComment = await updateComment(
      commentId,
      updatedComment,
      operations
    );

    expect(receivedComment).not.toBeNull();
    expect(receivedComment).toBeDefined();
    expect(receivedComment).toHaveProperty('text', updatedComment.text);
    expect(receivedComment).toHaveProperty('show', updatedComment.show);
    expect(receivedComment).toHaveProperty('user', { _id: adminId });
    expect(receivedComment).toHaveProperty('product', { _id: productId });
  });
  it('should delete comment and return it', async () => {
    const receivedComment = await deleteComment(adminId, commentId, operations);

    expect(receivedComment).not.toBeNull();
    expect(receivedComment).toBeDefined();
    expect(receivedComment).toHaveProperty('text', updatedComment.text);
  });

  it('should return error if id of comment to update is not correct', async () => {
    const receivedComment = await updateComment(
      commentWrongId,
      updatedComment,
      operations
    );

    expect(receivedComment).not.toBeNull();
    expect(receivedComment).toBeDefined();
    expect(receivedComment).toHaveProperty('message', COMMENT_NOT_FOUND);
    expect(receivedComment).toHaveProperty('statusCode', 404);
  });

  it('should add comment with bought order icon', async () => {
    const order = await createOrder(
      newOrderInputData(productId, modelId, sizeId, constructorBasicId),
      operations
    );
    orderId = order._id;
    const receivedComment = await addComment(
      productId,
      newComment(adminId),
      operations
    );
    commentId = receivedComment._id;

    expect(receivedComment).not.toBeNull();
    expect(receivedComment).toBeDefined();
    expect(receivedComment).toHaveProperty('product', { _id: productId });
    expect(receivedComment).toHaveProperty('text', newComment(adminId).text);
    expect(receivedComment).toHaveProperty('user', { _id: adminId });
    expect(receivedComment).toHaveProperty('show', newComment(adminId).show);
    expect(receivedComment).toHaveProperty('isSelled', true);
  });

  it('should add reply to comment with bought order icon', async () => {
    const receivedComment = await addReplyComment(
      productId,
      newReplyComment(adminId, commentId),
      operations,
      commentId
    );
    replyId = receivedComment.replyComments[0]._id;

    expect(receivedComment).not.toBeNull();
    expect(receivedComment).toBeDefined();
    expect(receivedComment.replyComments[0]).toHaveProperty(
      'replyText',
      newReplyComment(adminId, commentId).replyText
    );
    expect(receivedComment.replyComments[0]).toHaveProperty(
      'refToReplyComment',
      newReplyComment(adminId, commentId).refToReplyComment
    );
    expect(receivedComment.replyComments[0]).toHaveProperty('isSelled', true);
  });
  it('should return error if id of comment to add reply is not correct', async () => {
    const receivedComment = await addReplyComment(
      productId,
      newReplyComment(adminId, commentWrongId),
      operations,
      commentWrongId
    );

    expect(receivedComment).not.toBeNull();
    expect(receivedComment).toBeDefined();
    expect(receivedComment).toHaveProperty('message', COMMENT_NOT_FOUND);
    expect(receivedComment).toHaveProperty('statusCode', 404);
  });
  it('should update replyComment', async () => {
    const receivedComment = await updateReplyComment(
      replyId,
      updatedReplyComment,
      operations
    );

    expect(receivedComment).not.toBeNull();
    expect(receivedComment).toBeDefined();
    expect(receivedComment.replyComments[0].replyText).toHaveProperty(
      'replyText',
      updatedReplyComment.text
    );
    expect(receivedComment.replyComments[0].showReplyComment).toHaveProperty(
      'showReplyComment',
      updatedReplyComment.show
    );
  });
  it('should return error if id of reply comment to update is not correct', async () => {
    const receivedComment = await updateReplyComment(
      commentWrongId,
      updatedReplyComment,
      operations
    );

    expect(receivedComment).not.toBeNull();
    expect(receivedComment).toBeDefined();
    expect(receivedComment).toHaveProperty(
      'message',
      REPLY_COMMENT_IS_NOT_PRESENT
    );
    expect(receivedComment).toHaveProperty('statusCode', 404);
  });
  it('should delete reply comment and return it', async () => {
    const receivedComment = await deleteReplyComment(
      adminId,
      replyId,
      operations
    );

    expect(receivedComment).not.toBeNull();
    expect(receivedComment).toBeDefined();
    expect(receivedComment).toHaveProperty('_id', commentId);
  });
  it('should return an error if reply comment to delete not exist', async () => {
    const receivedComment = await deleteReplyComment(
      adminId,
      commentWrongId,
      operations
    );

    expect(receivedComment).not.toBeNull();
    expect(receivedComment).toBeDefined();
    expect(receivedComment).toHaveProperty(
      'message',
      REPLY_COMMENT_IS_NOT_PRESENT
    );
    expect(receivedComment).toHaveProperty('statusCode', 404);
  });
  it('should return an error if comment to delete not exist', async () => {
    const receivedComment = await deleteComment(
      adminId,
      commentWrongId,
      operations
    );

    expect(receivedComment).not.toBeNull();
    expect(receivedComment).toBeDefined();
    expect(receivedComment).toHaveProperty('message', COMMENT_NOT_FOUND);
    expect(receivedComment).toHaveProperty('statusCode', 404);
  });
  it('should add rate to the product', async () => {
    const receivedComment = await addRate(productId, rate, operations);

    expect(receivedComment).toMatchSnapshot();
    expect(receivedComment).not.toBeNull();
    expect(receivedComment).toBeDefined();
    expect(receivedComment).toHaveProperty('rate', rate);
    expect(receivedComment).toHaveProperty('rateCount', 1);
    expect(receivedComment.userRates.length).toEqual(1);
  });

  it('should update rate of the product', async () => {
    const receivedComment = await addRate(productId, updatedRate, operations);

    expect(receivedComment).toMatchSnapshot();
    expect(receivedComment).not.toBeNull();
    expect(receivedComment).toBeDefined();
    expect(receivedComment).toHaveProperty('rate', updatedRate);
    expect(receivedComment).toHaveProperty('rateCount', 1);
    expect(receivedComment.userRates.length).toEqual(1);
  });

  it('should return error if to add rate to not existing product', async () => {
    const receivedComment = await addRate(productWrongId, rate, operations);

    expect(receivedComment).toMatchSnapshot();
    expect(receivedComment).not.toBeNull();
    expect(receivedComment).toBeDefined();
    expect(receivedComment).toHaveProperty(
      'message',
      RATE_FOR_NOT_EXISTING_PRODUCT
    );
    expect(receivedComment).toHaveProperty('statusCode', 404);
  });

  afterAll(async () => {
    await deleteComment(adminId, commentId, operations);
    await deleteOrder(orderId, operations);
    await deleteProduct(productId, operations);
    await deleteModel(modelId, operations);
    await deleteConstructorBasic(constructorBasicId, operations);
    await deleteMaterial(materialId, operations);
    await deleteColor(colorId, operations);
    await deleteClosure(closureId, operations);
    await deletePattern(patternId, operations);
    await deleteCategory(categoryId, operations);
    await deleteSize(sizeId, operations);
  });
});
