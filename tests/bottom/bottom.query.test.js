const mongoose = require('mongoose');

const { setupApp } = require('../helper-functions');
const { BOTTOM_NOT_FOUND } = require('../../error-messages/bottom-messages');
const {
  createBottom,
  getAllBottoms,
  getBottomById,
} = require('./bottom.helper');
const {
  wrongId,
  filter,
  newBottomInputData,
  limit,
  skip,
} = require('./bottom.variables');
const { createColor } = require('../color/color.helper');
const { color } = require('../color/color.variables');
const { createMaterial } = require('../materials/material.helper');
const { getMaterial } = require('../materials/material.variables');

let operations;
let colorId;
let materialInput;
let materialId;
let bottomInput;
let bottomDataForQuery;

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.utils.js');
jest.mock('../../modules/currency/currency.model.js');

describe('Bottom query test', () => {
  beforeAll(async () => {
    operations = await setupApp();
    const colorData = await createColor(color, operations);
    colorId = colorData._id;
    filter.color.push(colorId);
    materialInput = getMaterial(colorId);
    const materialData = await createMaterial(materialInput, operations);
    materialId = materialData._id;
    filter.material.push(materialId);

    bottomInput = newBottomInputData(materialId, colorId);

    bottomDataForQuery = await createBottom(bottomInput, 'img.jpg', operations);
  });
  test('should get all bottoms', async () => {
    const result = await getAllBottoms({ limit, skip, filter }, operations);

    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });
  test('getAllBottoms with empty filter', async () => {
    filter.material = [];
    filter.color = [];
    const result = await getAllBottoms({ limit, skip, filter }, operations);

    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });
  test('getAllBottoms should return empty array', async () => {
    filter.material = [wrongId];
    const result = await getAllBottoms({ limit, skip, filter }, operations);

    expect(result).toBeDefined();
    expect(result.length).toBe(0);
  });
  test('should get bottom by id', async () => {
    const result = await getBottomById(bottomDataForQuery._id, operations);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('available', bottomInput.available);
    expect(result).toHaveProperty('name', bottomInput.name);
  });
  test('getBottomById should get BOTTOM_NOT_FOUND error msg', async () => {
    const result = await getBottomById(wrongId, operations);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('message', BOTTOM_NOT_FOUND);
    expect(result).toHaveProperty('statusCode', 404);
  });
  afterAll(async () => {
    mongoose.connection.db.dropDatabase();
  });
});
