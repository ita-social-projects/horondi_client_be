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
const { createBasics, getBasicById, getAllBasics } = require('./basics.helper');
const { createColor } = require('../color/color.helper');
const { color } = require('../color/color.variables');
const { createMaterial } = require('../materials/material.helper');
const { getMaterial } = require('../materials/material.variables');

let operations;
let colorId;
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
    basicsInput = newBasicsInputData(materialId, colorId);

    basicsDataForQuery = await createBasics(basicsInput, 'img.jpg', operations);
  });

  it('should get all basics', async () => {
    const result = await getAllBasics({ limit, skip, filter }, operations);

    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });

  it('GetAllBasics with empty filter', async () => {
    filter.material = [];
    filter.color = [];
    const result = await getAllBasics({ limit, skip, filter }, operations);

    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });

  it('should get basics by id', async () => {
    const result = await getBasicById(basicsDataForQuery._id, operations);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('available', basicsInput.available);
    expect(result).toHaveProperty('name', basicsInput.name);
  });

  it('getBasicById should get BASICS_NOT_FOUND error msg', async () => {
    const result = await getBasicById(wrongId, operations);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('message', BASICS_NOT_FOUND);
    expect(result).toHaveProperty('statusCode', 404);
  });

  afterAll(async () => {
    mongoose.connection.db.dropDatabase();
  });
});
