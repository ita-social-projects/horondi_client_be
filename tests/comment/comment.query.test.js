const {
  COMMENT_NOT_FOUND,
  COMMENT_FOR_NOT_EXISTING_USER,
  COMMENTS_NOT_FOUND,
} = require('../../error-messages/comment.messages');
const { setupApp } = require('../helper-functions');
const {
  newComment,
  commentWrongId,
  userWrongId,
  productWrongId,
  countComments,
  limitCount,
  filterComment,
  paginationComment,
} = require('./comment.variables');
const {
  deleteComment,
  addComment,
  getAllCommentsByUser,
  getAllCommentsByProduct,
  getCommentById,
  getAllComments,
  getRecentComments,
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
    const authRes = await loginAdmin(
      superAdminUser.email,
      superAdminUser.password,
      operations
    );
    adminId = authRes.data.loginAdmin._id;
    const commentData = await addComment(
      productId,
      newComment(adminId),
      operations
    );
    commentId = commentData._id;
  });

  it('Should receive all comments', async () => {
    const receivedComments = await getAllComments(
      filterComment,
      paginationComment,
      operations
    );
    return new Promise(done => {
      expect(receivedComments).toBeDefined();
      expect(receivedComments).toHaveProperty('count', countComments);
      expect(receivedComments.items[0]).toHaveProperty('_id', commentId);
      expect(receivedComments.items[0]).toHaveProperty(
        'text',
        newComment(adminId).text
      );
      done();
    });
  });
  it('Should receive recent comments', async () => {
    const receivedComments = await getRecentComments(limitCount, operations);
    return new Promise(done => {
      expect(receivedComments).toBeDefined();
      expect(receivedComments[0]).toHaveProperty('_id', commentId);
      expect(receivedComments[0]).toHaveProperty(
        'text',
        newComment(adminId).text
      );
      done();
    });
  });
  it('Should receive all comments written by selected user', async () => {
    const res = await getAllCommentsByUser(adminId, operations);
    return new Promise(done => {
      expect(res).toBeDefined();
      expect(res[0]).toHaveProperty('product', { _id: productId });
      expect(res[0]).toHaveProperty('text', newComment(adminId).text);
      expect(res[0]).toHaveProperty('user', { _id: adminId });
      expect(res[0]).toHaveProperty('show', newComment(adminId).show);
      done();
    });
  });
  it('should return empty array of comments for unexciting id', async () => {
    const res = await getAllCommentsByUser(userWrongId, operations);
    return new Promise(done => {
      expect(res[0]).toBeDefined();
      expect(res[0].statusCode).toBe(404);
      expect(res[0].message).toBe(COMMENT_FOR_NOT_EXISTING_USER);
      done();
    });
  });
  it('Should receive all comments for one product', async () => {
    const res = await getAllCommentsByProduct(productId, operations);
    const receivedComments = res.data.getAllCommentsByProduct;
    return new Promise(done => {
      expect(receivedComments).toBeDefined();
      expect(receivedComments[0]).toHaveProperty('product', { _id: productId });
      expect(receivedComments[0]).toHaveProperty(
        'text',
        newComment(adminId).text
      );
      expect(receivedComments[0]).toHaveProperty('user', { _id: adminId });
      expect(receivedComments[0]).toHaveProperty(
        'show',
        newComment(adminId).show
      );
      done();
    });
  });
  it('Should receive COMMENT_NOT_FOUND for get all comments for one product', async () => {
    const res = await getAllCommentsByProduct(productWrongId, operations);
    const receivedComments = res.data.getAllCommentsByProduct;
    return new Promise(done => {
      expect(receivedComments[0]).toBeDefined();
      expect(receivedComments[0].statusCode).toBe(404);
      expect(receivedComments[0].message).toBe(COMMENT_NOT_FOUND);
      done();
    });
  });

  it('should return one comment', async () => {
    const receivedComment = await getCommentById(commentId, operations);
    return new Promise(done => {
      expect(receivedComment).toBeDefined();
      expect(receivedComment).toEqual({
        product: { _id: productId },
        text: newComment(adminId).text,
        user: { _id: adminId },
        show: newComment(adminId).show,
      });
      done();
    });
  });
  it('should return error when find comment by wrong id', async () => {
    const receivedComment = await getCommentById(commentWrongId, operations);
    return new Promise(done => {
      expect(receivedComment).toBeDefined();
      expect(receivedComment).toHaveProperty('statusCode', 404);
      expect(receivedComment).toHaveProperty('message', COMMENT_NOT_FOUND);
      done();
    });
  });
  it('Should receive recent comments with error', async () => {
    await deleteComment(adminId, commentId, operations);
    const receivedComments = await getRecentComments(limitCount, operations);
    return new Promise(done => {
      expect(receivedComments).toBeDefined();
      expect(receivedComments.statusCode).toBe(404);
      expect(receivedComments.message).toBe(COMMENTS_NOT_FOUND);
      done();
    });
  });
  afterAll(async () => {
    await deleteComment(adminId, commentId, operations);
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
