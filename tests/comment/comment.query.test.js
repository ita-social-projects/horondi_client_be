const { COMMENT_NOT_FOUND } = require('../../error-messages/comment.messages');
const { setupApp } = require('../helper-functions');
const {
  newComment,
  commentWrongId,
  validEmail,
  invalidEmail,
  productWrongId,
} = require('./comment.variables');
const {
  deleteComment,
  addComment,
  getAllCommentsByUser,
  getAllCommentsByProduct,
  getCommentById,
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
    const commentData = await addComment(productId, newComment, operations);
    commentId = commentData._id;
  });

  it(' Should receive all comments written by selected user', async () => {
    const res = await getAllCommentsByUser(validEmail, operations);

    expect(res).toBeDefined();
    expect(res).toContainEqual({
      product: { _id: productId },
      text: newComment.text,
      user: newComment.user,
      show: newComment.show,
    });
  });
  it(' should return empty array of comments for unexciting email ', async () => {
    const res = await getAllCommentsByUser(invalidEmail, operations);

    expect(res).toBeDefined();
    expect(res.length).toBe(0);
    expect(res).toBeInstanceOf(Array);
  });
  it(' Should receive all comments for one product', async () => {
    const res = await getAllCommentsByProduct(productId, operations);
    const receivedComments = res.data.getAllCommentsByProduct.items;

    expect(receivedComments).toBeDefined();
    expect(receivedComments).toContainEqual({
      product: { _id: productId },
      text: newComment.text,
      user: newComment.user,
      show: newComment.show,
    });
  });
  it(' Should receive COMMENT_NOT_FOUND for get all comments for one product', async () => {
    const res = await getAllCommentsByProduct(productWrongId, operations);
    const error = res.errors[0].message;

    expect(error).toBeDefined();
    expect(error).toBe(COMMENT_NOT_FOUND);
  });

  it(' should return one comment', async () => {
    const receivedComment = await getCommentById(commentId, operations);

    expect(receivedComment).toBeDefined();
    expect(receivedComment).toBeDefined();
    expect(receivedComment).toEqual({
      product: { _id: productId },
      text: newComment.text,
      user: newComment.user,
      show: newComment.show,
    });
  });
  it(' should return error when find comment by wrong id', async () => {
    const receivedComment = await getCommentById(commentWrongId, operations);

    expect(receivedComment).toBeDefined();
    expect(receivedComment).toMatchSnapshot();
    expect(receivedComment).toBeDefined();
    expect(receivedComment).toHaveProperty('statusCode', 404);
    expect(receivedComment).toHaveProperty('message', COMMENT_NOT_FOUND);
  });

  afterAll(async () => {
    await deleteComment(commentId, operations);
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
