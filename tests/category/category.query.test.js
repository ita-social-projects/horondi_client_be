const { setupApp } = require('../helper-functions');
const {
  CATEGORY_NOT_FOUND,
} = require('../../error-messages/category.messages');
const {
  deleteCategory,
  createCategory,
  getAllCategories,
  getCategoryById,
} = require('./category.helper');
const { wrongId, newCategoryInputData } = require('./category.variables');

jest.mock('../../modules/upload/upload.service');

let operations;
let categoryId;

describe('Closure queries', () => {
  beforeAll(async done => {
    operations = await setupApp();
    const categoryData = await createCategory(newCategoryInputData, operations);
    categoryId = categoryData._id;
    done();
  });

  test('should get all categories', async done => {
    const result = await getAllCategories(operations);

    expect(result).toBeDefined();
    expect(result[0]).toHaveProperty('code', newCategoryInputData.code);
    expect(result[0]).toHaveProperty(
      'available',
      newCategoryInputData.available
    );
    expect(result[0]).toHaveProperty('name', newCategoryInputData.name);
    done();
  });
  test('should get category by id', async done => {
    const result = await getCategoryById(categoryId, operations);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('code', newCategoryInputData.code);
    expect(result).toHaveProperty('available', newCategoryInputData.available);
    expect(result).toHaveProperty('name', newCategoryInputData.name);
    done();
  });
  test('should get CATEGORY_NOT_FOUND error msg', async done => {
    const result = await getCategoryById(wrongId, operations);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('message', CATEGORY_NOT_FOUND);
    expect(result).toHaveProperty('statusCode', 404);
    done();
  });

  afterAll(async done => {
    await deleteCategory(categoryId, operations);
    done();
  });
});
