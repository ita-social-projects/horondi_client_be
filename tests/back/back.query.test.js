const { setupApp } = require('../helper-functions');
const { BACK_NOT_FOUND } = require('../../consts/back-messages');
const {
  createMaterial,
  deleteMaterial,
} = require('../materials/material.helper');
const { getMaterial } = require('../materials/material.variables');
const { createColor, deleteColor } = require('../color/color.helper');
const { color } = require('../color/color.variables');
const {
  deleteBack,
  createBack,
  getAllBacks,
  getBackById,
} = require('./back.helper');
const { wrongId, newBackInputData } = require('./back.variables');
const { createModel } = require('../model/model.helper');
const { newModel } = require('../model/model.variables');

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.model.js');
jest.mock('../../modules/currency/currency.utils.js');

let operations;
let backId;
let materialId;
let colorId;

describe('Closure queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
    const colorData = await createColor(color, operations);
    colorId = colorData._id;
    const materialData = await createMaterial(getMaterial(colorId), operations);
    materialId = materialData._id;
    const backData = await createBack(
      newBackInputData(materialId, colorId),
      operations
    );
    backId = backData._id;
  });

  test('should get all backs', async () => {
    const result = await getAllBacks(operations);

    expect(result).toBeDefined();
    expect(result[0]).toHaveProperty(
      'available',
      newBackInputData(materialId, colorId).available
    );
    expect(result[0]).toHaveProperty(
      'name',
      newBackInputData(materialId, colorId).name
    );
  });
  test('should get back by id', async () => {
    const result = await getBackById(backId, operations);

    expect(result).toBeDefined();
    expect(result).toHaveProperty(
      'available',
      newBackInputData(materialId, colorId).available
    );
    expect(result).toHaveProperty(
      'name',
      newBackInputData(materialId, colorId).name
    );
  });
  test('should get BACK_NOT_FOUND error msg', async () => {
    const result = await getBackById(wrongId, operations);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('message', BACK_NOT_FOUND);
    expect(result).toHaveProperty('statusCode', 404);
  });

  afterAll(async () => {
    await deleteBack(backId, operations);
    await deleteColor(colorId, operations);
    await deleteMaterial(materialId, operations);
  });
});
