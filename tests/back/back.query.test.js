const mongoose = require('mongoose');

const { setupApp } = require('../helper-functions');
const { BACK_NOT_FOUND } = require('../../consts/back-messages');
const {
  createBack,
  getAllBacks,
  getBackById,
  getBacksByModel,
} = require('./back.helper');
const {
  wrongId,
  filter,
  newBackInputData,
  limit,
  skip,
} = require('./back.variables');
const { createColor } = require('../color/color.helper');
const { color } = require('../color/color.variables');
const { createMaterial } = require('../materials/material.helper');
const { getMaterial } = require('../materials/material.variables');
const { createModel } = require('../model/model.helper');
const { newModel } = require('../model/model.variables');
const { createCategory } = require('../category/category.helper');
const { newCategoryInputData } = require('../category/category.variables');

let operations;
let colorId;
let modelId;
let categoryId;
let materialInput;
let materialId;
let backInput;
let createdModel;
let backDataForQuery;

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.utils.js');
jest.mock('../../modules/currency/currency.model.js');

describe('Back query test', () => {
  beforeAll(async () => {
    operations = await setupApp();
    const colorData = await createColor(color, operations);
    colorId = colorData._id;
    filter.color.push(colorId);
    materialInput = getMaterial(colorId);
    const materialData = await createMaterial(materialInput, operations);
    materialId = materialData._id;
    filter.material.push(materialId);
    const categoryData = await createCategory(newCategoryInputData, operations);
    categoryId = categoryData._id;

    createdModel = newModel(categoryId);

    const modelData = await createModel(createdModel, operations);
    modelId = modelData._id;

    backInput = newBackInputData(materialId, colorId, modelId);

    backDataForQuery = await createBack(backInput, 'img.jpg', operations);
  });
  test('should get all backs', async () => {
    const result = await getAllBacks({ limit, skip, filter }, operations);

    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });
  test('GetAllBacks with empty filter', async () => {
    filter.material = [];
    filter.color = [];
    const result = await getAllBacks({ limit, skip, filter }, operations);

    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });
  test('getAllBacks should return empty array', async () => {
    filter.material = [wrongId];
    const result = await getAllBacks({ limit, skip, filter }, operations);

    expect(result).toBeDefined();
    expect(result.length).toBe(0);
  });
  test('should get back by id', async () => {
    const result = await getBackById(backDataForQuery._id, operations);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('available', backInput.available);
    expect(result).toHaveProperty('name', backInput.name);
  });
  test('should get backs by model', async () => {
    const result = await getBacksByModel(modelId, operations);

    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });
  test('getBackById should get BACK_NOT_FOUND error msg', async () => {
    const result = await getBackById(wrongId, operations);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('message', BACK_NOT_FOUND);
    expect(result).toHaveProperty('statusCode', 404);
  });
  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
  });
});
