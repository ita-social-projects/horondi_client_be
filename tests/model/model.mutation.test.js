const { newModel, newModelUpdated, wrongId } = require('./model.variables');
const { createModel, deleteModel, updateModel } = require('./model.helper');
const { createSize, deleteSize } = require('../size/size.helper');
const { createPlainSize } = require('../size/size.variables');
const { setupApp } = require('../helper-functions');
const {
  deleteCategory,
  createCategory,
} = require('../category/category.helper');
const { newCategoryInputData } = require('../category/category.variables');
const { ITEM_ALREADY_EXISTS } = require('../../error-messages/common.messages');
const {
  STATUS_CODES: { BAD_REQUEST },
} = require('../../consts/status-codes');

const MODEL_NOT_FOUND = 'MODEL_NOT_FOUND';
let modelId;
let categoryId;
let operations;
let sizeId;

jest.mock('../../modules/upload/__mocks__/upload.service.js');
jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.model.js');
jest.mock('../../modules/currency/currency.utils.js');

describe('Model mutations', () => {
  beforeAll(async () => {
    operations = await setupApp();
    const createdCategory = await createCategory(
      newCategoryInputData,
      operations
    );
    categoryId = createdCategory._id;
  });

  test('Should create model', async () => {
    const model = await createModel(newModel(categoryId, sizeId), operations);
    modelId = model._id;
    const createdSize = await createSize(
      createPlainSize(modelId).size1,
      operations
    );
    sizeId = createdSize._id;
    expect(model).toBeDefined();
    expect(model).toHaveProperty(
      'name',
      newModel(categoryId, sizeId).name.map(item => ({
        ...item,
      }))
    );
    expect(model).toHaveProperty(
      'description',
      newModel(categoryId, sizeId).description.map(item => ({
        ...item,
      }))
    );
  });
  test('Should throw error ITEM_ALREADY_EXISTS', async () => {
    const error = await createModel(newModel(categoryId, sizeId), operations);

    expect(error).toBeDefined();
    expect(error).toHaveProperty('statusCode', BAD_REQUEST);
    expect(error).toHaveProperty('message', ITEM_ALREADY_EXISTS);
  });
  test('Should throw error MODEL_NOT_FOUND', async () => {
    const error = await deleteModel(wrongId, operations);

    expect(error).toBeDefined();
    expect(error).toHaveProperty('message', MODEL_NOT_FOUND);
  });
  test('Should update model', async () => {
    const modelUpdate = await updateModel(
      modelId,
      newModelUpdated(categoryId, sizeId),
      operations
    );

    expect(modelUpdate).toBeDefined();
    expect(modelUpdate).toHaveProperty(
      'name',
      newModelUpdated(categoryId, sizeId).name.map(item => ({
        ...item,
      }))
    );
    expect(modelUpdate).toHaveProperty(
      'description',
      newModelUpdated(categoryId, sizeId).description.map(item => ({
        ...item,
      }))
    );
  });
  test('Should delete model', async () => {
    const modelDelete = await deleteModel(modelId, operations);

    expect(modelDelete).toBeDefined();
    expect(modelDelete._id).toEqual(modelId);
  });

  afterAll(async () => {
    await deleteCategory(categoryId, operations);
    await deleteSize(sizeId, operations);
  });
});
