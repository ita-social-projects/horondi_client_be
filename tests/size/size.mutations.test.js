const mongoose = require('mongoose');
const { setupApp } = require('../helper-functions');
const {
  createPlainSize,
  createTestSize,
  WRONG_ID,
  ERROR_NOT_FOUND,
} = require('./size.variables');
const {
  createSize,
  getSizeById,
  updateSize,
  deleteSize,
} = require('./size.helper');
const { createModel } = require('../model/model.helper');
const { createCategory } = require('../category/category.helper');
const { newCategoryInputData } = require('../category/category.variables');
const { newModel } = require('../model/model.variables');
const { SIZE_ALREADY_EXIST } = require('../../error-messages/size.messages');

jest.mock('../../modules/currency/currency.model.js');
jest.mock('../../modules/currency/currency.utils.js');
jest.mock('../../modules/upload/upload.service');

let operations;
let sizeId;
let size_updated;
let categoryId;
let modelId;

describe('Sizes mutations', () => {
  beforeAll(async () => {
    operations = await setupApp();

    const category = await createCategory(newCategoryInputData, operations);
    categoryId = category._id;
    const model = await createModel(newModel(categoryId), operations);
    modelId = model._id;
  });

  test('should add size', async () => {
    const result = await createSize(createPlainSize(modelId).size1, operations);
    sizeId = result._id;

    expect(result).toEqual({
      _id: sizeId,
      ...createTestSize(modelId).size1,
    });
  });

  test('should get SIZE_ALREADY_EXIST error message when create size', async () => {
    const result = await createSize(createPlainSize(modelId).size1, operations);

    expect(result).toHaveProperty('message', SIZE_ALREADY_EXIST);
    expect(result).toHaveProperty('statusCode', 400);
  });

  test('should update size by ID and input', async () => {
    await updateSize(sizeId, createPlainSize(modelId).size2, operations);
    const resultGetSizeById = await getSizeById(sizeId, operations);
    size_updated = resultGetSizeById;

    expect(resultGetSizeById).toEqual({
      _id: sizeId,
      ...createTestSize(modelId).size2,
    });
  });

  test('should receive error message SIZE_NOT_FOUND while updating', async () => {
    const result = await updateSize(
      WRONG_ID,
      createPlainSize(modelId).size1,
      operations
    );

    expect(result).toEqual({
      ...ERROR_NOT_FOUND,
    });
  });

  test('Should delete size by ID', async () => {
    const result = await deleteSize(sizeId, operations);

    expect(result).toEqual({
      ...size_updated,
    });
  });

  test('should recieve error SIZE_NOT_FOUND while deleting', async () => {
    const result = await deleteSize(WRONG_ID, operations);

    expect(result).toEqual(ERROR_NOT_FOUND);
  });

  afterAll(async () => {
    mongoose.connection.db.dropDatabase();
  });
});
