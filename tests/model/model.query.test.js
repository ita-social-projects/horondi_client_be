const { wrongId, notValidId, newModel } = require('./model.variables');
const {
  createModel,
  deleteModel,
  getModelsByCategory,
  getModelById,
} = require('./model.helper');
const { createSize, deleteSize } = require('../size/size.helper');
const { SIZES_TO_CREATE } = require('../size/size.variables');
const { setupApp } = require('../helper-functions');
const {
  deleteCategory,
  createCategory,
} = require('../category/category.helper');
const { newCategoryInputData } = require('../category/category.variables');

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.model.js');
jest.mock('../../modules/currency/currency.utils.js');

let modelId;
let categoryId;
let operations;
let sizeId;
const CATEGORY_NOT_VALID = 'CATEGORY_NOT_VALID';
const MODEL_NOT_VALID = 'MODEL_NOT_VALID';
const MODEL_NOT_FOUND = 'MODEL_NOT_FOUND';

describe('Model queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
    const createdSize = await createSize(SIZES_TO_CREATE.size1, operations);
    sizeId = createdSize._id;
    const createdCategory = await createCategory(
      newCategoryInputData,
      operations
    );
    categoryId = createdCategory._id;
    const createdModel = await createModel(
      newModel(categoryId, sizeId),
      operations
    );
    modelId = createdModel._id;
  });

  test('Should receive all models by category id', async () => {
    const res = await getModelsByCategory(categoryId, operations);
    const models = res.data.getModelsByCategory;

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
    const error = await getModelsByCategory(notValidId, operations);

    expect(error.errors[0].message).toBe(CATEGORY_NOT_VALID);
  });
  test('Should return empty array when category isnt exist', async () => {
    const res = await getModelsByCategory(wrongId, operations);

    const modelsByCategory = res.data.getModelsByCategory;
    expect(modelsByCategory.length).toBe(0);
    expect(modelsByCategory).toBeInstanceOf(Array);
  });
  test('Should return model by id', async () => {
    const res = await getModelById(modelId, operations);

    const modelsById = res.data.getModelById;

    expect(modelsById).toBeDefined();
    expect(modelsById).toHaveProperty('name', [
      { value: 'Тест', lang: 'uk' },
      { value: 'Test', lang: 'en' },
    ]);
    expect(modelsById).toHaveProperty('description', [
      { value: 'Тест', lang: 'uk' },
      { value: 'Test', lang: 'en' },
    ]);
    expect(modelsById).toHaveProperty('category');
  });
  test('Should throw error MODEL_NOT_VALID', async () => {
    const error = await getModelById(notValidId, operations);

    expect(error.data.getModelById.message).toBe(MODEL_NOT_VALID);
    expect(error.data.getModelById.statusCode).toBe(404);
  });
  test('Should throw error MODEL_NOT_FOUND', async () => {
    const error = await getModelById(wrongId, operations);

    expect(error.data.getModelById.message).toBe(MODEL_NOT_FOUND);
    expect(error.data.getModelById.statusCode).toBe(404);
  });

  afterAll(async () => {
    await deleteModel(modelId, operations);
    await deleteCategory(categoryId, operations);
    await deleteSize(sizeId, operations);
  });
});
