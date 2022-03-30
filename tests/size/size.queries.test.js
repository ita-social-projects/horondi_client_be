const { setupApp } = require('../helper-functions');
const { createPlainSize, createTestSize } = require('./size.variables');
const {
  createSize,
  getAllSizes,
  getSizeById,
  deleteSize,
} = require('./size.helper');
const { createModel, deleteModel } = require('../model/model.helper');
const {
  createCategory,
  deleteCategory,
} = require('../category/category.helper');
const { newCategoryInputData } = require('../category/category.variables');
const { newModel } = require('../model/model.variables');

jest.mock('../../modules/currency/currency.model.js');
jest.mock('../../modules/currency/currency.utils.js');
jest.mock('../../modules/upload/upload.service');

let operations;
let sizeId;
let categoryId;
let modelId;

describe('Sizes queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
    const category = await createCategory(newCategoryInputData, operations);
    categoryId = category._id;
    const model = await createModel(newModel(categoryId), operations);
    modelId = model._id;
    const size = await createSize(createPlainSize(modelId).size1, operations);
    sizeId = size._id;
  });

  test('should recieve all sizes', async () => {
    const result = await getAllSizes(operations);

    expect(result[0]).toEqual(createTestSize(modelId).size1);
  });

  test('should recieve sizes by ID', async () => {
    const result = await getSizeById(sizeId, operations);

    expect(result).toEqual({
      _id: sizeId,
      ...createTestSize(modelId).size1,
    });
  });

  afterAll(async () => {
    await deleteCategory(categoryId, operations);
    await deleteModel(modelId, operations);
    await deleteSize(sizeId, operations);
  });
});
