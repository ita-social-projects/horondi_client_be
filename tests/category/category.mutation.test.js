const { setupApp } = require('../helper-functions');
const {
  CATEGORY_NOT_FOUND,
  CATEGORY_ALREADY_EXIST,
} = require('../../error-messages/category.messages');
const {
  deleteCategory,
  createCategory,
  updateCategory,
} = require('./category.helper');
const {
  wrongId,
  newCategoryInputData,
  newCategoryInputDataUpdate,
} = require('./category.variables');

jest.mock('../../modules/upload/upload.service');

let operations;
let categoryId;

describe('Closure queries', () => {
  beforeAll(async done => {
    operations = await setupApp();
    done();
  });

  test('should create category', async done => {
    const result = await createCategory(newCategoryInputData, operations);
    categoryId = result._id;

    expect(result).toBeDefined();
    expect(result).toHaveProperty('code', newCategoryInputData.code);
    expect(result).toHaveProperty('available', newCategoryInputData.available);
    expect(result).toHaveProperty('name', newCategoryInputData.name);
    done();
  });
  test('should get CATEGORY_ALREADY_EXIST err msg for create', async done => {
    const result = await createCategory(newCategoryInputData, operations);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('message', CATEGORY_ALREADY_EXIST);
    expect(result).toHaveProperty('statusCode', 400);
    done();
  });
  test('should update category', async done => {
    const result = await updateCategory(
      categoryId,
      newCategoryInputDataUpdate,
      operations
    );

    expect(result).toBeDefined();
    expect(result).toHaveProperty('code', newCategoryInputDataUpdate.code);
    expect(result).toHaveProperty(
      'available',
      newCategoryInputDataUpdate.available
    );
    expect(result).toHaveProperty('name', newCategoryInputDataUpdate.name);
    done();
  });
  test('should get CATEGORY_NOT_FOUND err msg for create', async done => {
    const result = await updateCategory(
      wrongId,
      newCategoryInputDataUpdate,
      operations
    );

    expect(result).toBeDefined();
    expect(result).toHaveProperty('message', CATEGORY_NOT_FOUND);
    expect(result).toHaveProperty('statusCode', 404);
    done();
  });
  test('should get CATEGORY_NOT_FOUND err msg for delete', async done => {
    const result = await deleteCategory(wrongId, operations);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('statusCode', 404);
    done();
  });
  test('should delete category', async done => {
    const result = await deleteCategory(categoryId, operations);

    expect(result).toBeDefined();
    done();
  });
});
