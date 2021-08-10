const mongoose = require('mongoose');

const { setupApp } = require('../helper-functions');
const { BASICS_NOT_FOUND } = require('../../consts/basics-messages');
const {
  skip,
  limit,
  filter,
  wrongId,
  newBasicsInputData,
} = require('./basics.variables');
const {
  createBasics,
  getBasicsById,
  getAllBasics,
} = require('./basics.helper');
const { createColor } = require('../color/color.helper');
const { color } = require('../color/color.variables');
const { createMaterial } = require('../materials/material.helper');
const { getMaterial } = require('../materials/material.variables');
const { createCategory } = require('../category/category.helper');
const { newCategoryInputData } = require('../category/category.variables');

let operations;
let colorId;
let categoryId;
let materialInput;
let materialId;
let basicsInput;
let basicsDataForQuery;

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.utils.js');

describe('Basics query test', () => {
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

    basicsInput = newBasicsInputData(materialId, colorId);

    basicsDataForQuery = await createBasics(basicsInput, 'img.jpg', operations);
  });

  test('should get all basics', async () => {
    const result = await getAllBasics({ limit, skip, filter }, operations);

    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });

  test('should get basics by id', async () => {
    const result = await getBasicsById(basicsDataForQuery._id, operations);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('available', basicsInput.available);
    expect(result).toHaveProperty('name', basicsInput.name);
  });

  test('getBasicsById should get BASICS_NOT_FOUND error msg', async () => {
    const result = await getBasicsById(wrongId, operations);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('message', BASICS_NOT_FOUND);
    expect(result).toHaveProperty('statusCode', 404);
  });

  afterAll(async () => {
    mongoose.connection.db.dropDatabase();
  });
});
