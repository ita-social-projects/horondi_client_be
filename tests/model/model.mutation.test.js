const { newModel, newModelUpdated, wrongId } = require('./model.variables');
const { createModel, deleteModel, updateModel } = require('./model.helper');
const { createSize, deleteSize } = require('../size/size.helper');
const { SIZES_TO_CREATE } = require('../size/size.variables');
const { setupApp } = require('../helper-functions');
const {
  deleteCategory,
  createCategory,
} = require('../category/category.helper');
const { newCategoryInputData } = require('../category/category.variables');

const MODEL_NOT_FOUND = 'MODEL_NOT_FOUND';
const MODEL_ALREADY_EXIST = 'MODEL_ALREADY_EXIST';
let modelId;
let categoryName;
let categoryId;
let operations;
let sizeId;

jest.mock('../../modules/upload/__mocks__/upload.service.js');
jest.mock('../../modules/upload/upload.service');

describe('Model mutations', () => {
  beforeAll(async done => {
    operations = await setupApp();
    const createdSize = await createSize(SIZES_TO_CREATE.size1, operations);
    sizeId = createdSize._id;
    const createdCategory = await createCategory(
      newCategoryInputData,
      operations
    );
    categoryId = createdCategory._id;
    categoryName = createdCategory.name;
    done();
  });

  test('Should create model', async done => {
    const model = await createModel(newModel(categoryId, sizeId), operations);
    modelId = model._id;

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
    done();
  });
  test('Should throw error MODEL_ALREADY_EXIST', async done => {
    const error = await createModel(newModel(categoryId, sizeId), operations);

    expect(error).toBeDefined();
    expect(error).toHaveProperty('statusCode', 400);
    expect(error).toHaveProperty('message', MODEL_ALREADY_EXIST);
    done();
  });
  test('Should throw error MODEL_NOT_FOUND', async done => {
    const error = await deleteModel(wrongId, operations);

    expect(error).toBeDefined();
    expect(error).toHaveProperty('message', MODEL_NOT_FOUND);
    done();
  });
  test('Should update model', async done => {
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
    done();
  });
  test('Should delete model', async done => {
    const modelDelete = await deleteModel(modelId, operations);

    expect(modelDelete).toBeDefined();
    expect(modelDelete._id).toEqual(modelId);
    done();
  });

  afterAll(async done => {
    await deleteCategory(categoryId, operations);
    await deleteSize(sizeId, operations);
    done();
  });
});
