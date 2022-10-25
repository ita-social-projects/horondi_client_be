const mongoose = require('mongoose');
const { PATTERN_NOT_FOUND } = require('../../error-messages/pattern.messages');
const { setupApp } = require('../helper-functions');
const {
  STATUS_CODES: { NOT_FOUND },
} = require('../../consts/status-codes');
const {
  createPattern,
  getAllPatterns,
  getPatternById,
  getAllPatternsPaginated,
} = require('./pattern.helper');
const {
  wrongId,
  filter,
  pagination,
  queryPatternToAdd,
} = require('./pattern.variables');
const { createColor } = require('../color/color.helper');
const { color } = require('../color/color.variables');
const { createMaterial } = require('../materials/material.helper');
const { getMaterial } = require('../materials/material.variables');
const { createModel } = require('../model/model.helper');
const { newModel } = require('../model/model.variables');
const { createCategory } = require('../category/category.helper');
const { newCategoryInputData } = require('../category/category.variables');

let patternId;
let res;
let colorId;
let operations;
let categoryId;
let modelId;
let materialId;

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.utils.js');
jest.mock('../../modules/currency/currency.model.js');

describe('Pattern queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
    const colorData = await createColor(color, operations);
    colorId = colorData._id;
    const materialData = await createMaterial(getMaterial(colorId), operations);
    materialId = materialData._id;
    const categoryData = await createCategory(newCategoryInputData, operations);
    categoryId = categoryData._id;

    const modelData = await createModel(newModel(categoryId), operations);
    modelId = modelData._id;
    res = await createPattern(
      queryPatternToAdd(materialId, modelId),
      operations
    );
    patternId = res._id;
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

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
  });
});
