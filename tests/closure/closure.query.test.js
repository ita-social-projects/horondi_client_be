const mongoose = require('mongoose');
const { setupApp } = require('../helper-functions');
const { CLOSURE_NOT_FOUND } = require('../../error-messages/closures.messages');
const { createClosure, getClosureById } = require('./closure.helper');
const {
  wrongId,
  newClosure,
  closureWithConvertedPrice,
} = require('./closure.variables');
const { createMaterial } = require('../materials/material.helper');
const { getMaterialToUpdate } = require('../materials/material.variables');
const { createColor } = require('../color/color.helper');
const { color } = require('../color/color.variables');
const { createModel } = require('../model/model.helper');
const { newModel } = require('../model/model.variables');
const { createCategory } = require('../category/category.helper');
const { newCategoryInputData } = require('../category/category.variables');
const { createSize } = require('../size/size.helper');
const {
  SIZES_TO_CREATE: { size1 },
  createPlainSize,
} = require('../size/size.variables');

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.utils.js');
jest.mock('../../modules/currency/currency.model.js');

let operations;
let closureId;
let materialId;
let colorId;
let modelId;
let categoryId;
let sizeId;

describe('Closure queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
    const colorData = await createColor(color, operations);
    colorId = colorData._id;
    const materialData = await createMaterial(
      getMaterialToUpdate(colorId),
      operations
    );
    materialId = materialData._id;
    const categoryData = await createCategory(newCategoryInputData, operations);
    categoryId = categoryData._id;

    const modelData = await createModel(
      newModel(categoryId, sizeId),
      operations
    );
    modelId = modelData._id;
    const sizeData = await createSize(
      createPlainSize(modelId).size1,
      operations
    );
    sizeId = sizeData._id;
    const closureData = await createClosure(
      newClosure(materialId, colorId, modelId),
      operations
    );
    closureId = closureData._id;
  });

  test('should receive closure by ID', async () => {
    const result = await getClosureById(closureId, operations);
    const convertedObj = await closureWithConvertedPrice(
      materialId,
      colorId,
      modelId
    );
    expect(result).toBeDefined();
    expect(result).toEqual({
      _id: closureId,
      ...convertedObj,
    });
  });
  test('should throw error CLOSURE_NOT_FOUND', async () => {
    const result = await getClosureById(wrongId, operations);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('message', CLOSURE_NOT_FOUND);
    expect(result).toHaveProperty('statusCode', 404);
  });

  afterAll(async () => {
    mongoose.connection.db.dropDatabase();
  });
});
