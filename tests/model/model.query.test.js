const {
  wrongId,
  notValidId,
  newModel,
  filter,
  sort,
  pagination,
} = require('./model.variables');
const {
  createModel,
  deleteModel,
  getModelsByCategory,
  getModelById,
  getAllModels,
} = require('./model.helper');
const { createSize, deleteSize } = require('../size/size.helper');
const { createPlainSize } = require('../size/size.variables');
const { setupApp } = require('../helper-functions');
const {
  deleteCategory,
  createCategory,
} = require('../category/category.helper');
const { newCategoryInputData } = require('../category/category.variables');
const {
  STATUS_CODES: { NOT_FOUND },
} = require('../../consts/status-codes');

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.model.js');
jest.mock('../../modules/currency/currency.utils.js');

let modelId;
let categoryId;
let operations;
let sizeId;
let createdModel;
const CATEGORY_NOT_VALID = 'CATEGORY_NOT_VALID';
const MODEL_NOT_VALID = 'MODEL_NOT_VALID';
const MODEL_NOT_FOUND = 'MODEL_NOT_FOUND';

describe('Model queries', () => {
  beforeAll(async () => {
    operations = await setupApp();

    const createdCategory = await createCategory(
      newCategoryInputData,
      operations
    );
    categoryId = createdCategory._id;
    createdModel = await createModel(newModel(categoryId, sizeId), operations);
    modelId = createdModel._id;
    const createdSize = await createSize(
      createPlainSize(modelId).size1,
      operations
    );
    sizeId = createdSize._id;
  });

  test('Should receive all models', async () => {
    const allModels = await getAllModels(filter, pagination, sort, operations);

    expect(allModels.items).toEqual([
      {
        ...createdModel,
      },
    ]);
  });
  test('Should receive all models by category id', async () => {
    const res = await getModelsByCategory(categoryId, operations);
    const models = res;

    expect(models).toBeDefined();
    expect(models.length).toBeGreaterThan(0);
    expect(models[0].name).toBeInstanceOf(Array);
    expect(models[0]).toHaveProperty('name', [
      { value: 'Тест', lang: 'uk' },
      { value: 'Test', lang: 'en' },
    ]);
    expect(models[0]).toHaveProperty('description', [
      { value: 'Тест', lang: 'uk' },
      { value: 'Test', lang: 'en' },
    ]);
    expect(models[0]).toHaveProperty('category');
  });
  test('Should throw error CATEGORY_NOT_VALID', async () => {
    const res = await getModelsByCategory(notValidId, operations);

    expect(res.message).toBe(CATEGORY_NOT_VALID);
  });
  test('Should return empty array when category doesnt exist', async () => {
    const res = await getModelsByCategory(wrongId, operations);

    expect(res.length).toBe(0);
    expect(res).toBeInstanceOf(Array);
  });
  test('Should return model by id', async () => {
    const res = await getModelById(modelId, operations);

    expect(res).toBeDefined();
    expect(res).toHaveProperty('name', [
      { value: 'Тест', lang: 'uk' },
      { value: 'Test', lang: 'en' },
    ]);
    expect(res).toHaveProperty('description', [
      { value: 'Тест', lang: 'uk' },
      { value: 'Test', lang: 'en' },
    ]);
    expect(res).toHaveProperty('category');
  });
  test('Should throw error MODEL_NOT_VALID', async () => {
    const error = await getModelById(notValidId, operations);

    expect(error.message).toBe(MODEL_NOT_VALID);
    expect(error.statusCode).toBe(NOT_FOUND);
  });
  test('Should throw error MODEL_NOT_FOUND', async () => {
    const error = await getModelById(wrongId, operations);

    expect(error.message).toBe(MODEL_NOT_FOUND);
    expect(error.statusCode).toBe(NOT_FOUND);
  });

  afterAll(async () => {
    await deleteModel(modelId, operations);
    await deleteCategory(categoryId, operations);
    await deleteSize(sizeId, operations);
  });
});
