const mongoose = require('mongoose');
const { PATTERN_NOT_FOUND } = require('../../error-messages/pattern.messages');
const { setupApp } = require('../helper-functions');
const {
  STATUS_CODES: { NOT_FOUND },
} = require('../../consts/status-codes');
const {
  createPattern,
  deletePattern,
  getAllPatterns,
  getPatternById,
  getAllPatternsPaginated,
} = require('./pattern.helper');
const {
  wrongId,
  filter,
  sort,
  pagination,
  wrongPagination,
  queryPatternToAdd,
} = require('./pattern.variables');
const { createColor, deleteColor } = require('../color/color.helper');
const { color } = require('../color/color.variables');
const {
  createMaterial,
  deleteMaterial,
} = require('../materials/material.helper');
const { getMaterial } = require('../materials/material.variables');
const { createModel, deleteModel } = require('../model/model.helper');
const { newModel } = require('../model/model.variables');
const {
  createCategory,
  deleteCategory,
} = require('../category/category.helper');
const { newCategoryInputData } = require('../category/category.variables');
const { createSize, deleteSize } = require('../size/size.helper');
const {
  SIZES_TO_CREATE: { size1 },
} = require('../size/size.variables');

let patternId,
  res,
  colorId,
  operations,
  categoryId,
  sizeId,
  modelId,
  materialId;

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.utils.js');
jest.mock('../../modules/currency/currency.model.js');

describe('Pattern queries', () => {
  beforeAll(async done => {
    operations = await setupApp();
    const colorData = await createColor(color, operations);
    colorId = colorData._id;
    const materialData = await createMaterial(getMaterial(colorId), operations);
    materialId = materialData._id;
    const categoryData = await createCategory(newCategoryInputData, operations);
    categoryId = categoryData._id;
    const sizeData = await createSize(size1, operations);
    sizeId = sizeData._id;
    const modelData = await createModel(
      newModel(categoryId, sizeId),
      operations
    );
    modelId = modelData._id;
    res = await createPattern(
      queryPatternToAdd(materialId, modelId),
      operations
    );
    patternId = res._id;
    done();
  });

  test('Should receive all patterns', async () => {
    const allPatterns = await getAllPatterns(
      pagination.limit,
      pagination.skip,
      filter,
      operations
    );
    expect(allPatterns.items).toEqual([
      {
        ...res,
      },
    ]);
  });
  test('Should receive one pattern', async () => {
    const pattern = await getPatternById(patternId, operations);

    expect(pattern).toEqual({
      ...res,
      _id: patternId,
    });
  });
  test('request not existing pattern should throw error', async () => {
    const pattern = await getPatternById(wrongId, operations);

    expect(pattern).toBeDefined();
    expect(pattern).toHaveProperty('statusCode', NOT_FOUND);
    expect(pattern).toHaveProperty('message', PATTERN_NOT_FOUND);
  });
  test('pattern pagination test', async () => {
    const paginatedPatterns = await getAllPatternsPaginated(
      pagination.limit,
      pagination.skip,
      filter,
      operations
    );

    expect(paginatedPatterns.items).toHaveLength(1);
    expect(paginatedPatterns.count).toEqual(1);
  });
  test('Expect negative values', async () => {
    const paginatedPatterns = await getAllPatternsPaginated(
      pagination.limit,
      wrongPagination.skip,
      filter,
      operations
    );

    expect(paginatedPatterns.message).toEqual(
      'Skip value must be non-negative, but received: -1'
    );
  });

  afterAll(async done => {
    mongoose.connection.db.dropDatabase(done);
  });
});
