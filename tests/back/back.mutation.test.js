const { setupApp } = require('../helper-functions');
const {
  BACK_NOT_FOUND,
  BACK_ALREADY_EXIST,
} = require('../../consts/back-messages');
const { deleteBack, createBack, updateBack } = require('./back.helper');
const {
  wrongId,
  newBackInputData,
  newBackInputDataUpdate,
} = require('./back.variables');
const { getMaterial } = require('../materials/material.variables');
const {
  createMaterial,
  deleteMaterial,
} = require('../materials/material.helper');
const { createColor, deleteColor } = require('../color/color.helper');
const { color } = require('../color/color.variables');

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
  });

  test('should create back', async () => {
    const colorData = await createColor(color, operations);
    colorId = colorData._id;
    const materialData = await createMaterial(getMaterial(colorId), operations);
    materialId = materialData._id;
    const result = await createBack(
      newBackInputData(materialId, colorId),
      operations
    );
    backId = result._id;

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
  test('should get BACK_ALREADY_EXIST err msg for create', async () => {
    const result = await createBack(
      newBackInputData(materialId, colorId),
      operations
    );

    expect(result).toBeDefined();
    expect(result).toHaveProperty('message', BACK_ALREADY_EXIST);
    expect(result).toHaveProperty('statusCode', 400);
  });
  test('should update back', async () => {
    const result = await updateBack(
      backId,
      newBackInputDataUpdate(materialId, colorId),
      operations
    );

    expect(result).toBeDefined();
    expect(result).toHaveProperty(
      'available',
      newBackInputDataUpdate(materialId, colorId).available
    );
    expect(result).toHaveProperty(
      'name',
      newBackInputDataUpdate(materialId, colorId).name
    );
  });
  test('should get BACK_NOT_FOUND err msg for create', async () => {
    const result = await updateBack(
      wrongId,
      newBackInputDataUpdate(materialId, colorId),
      operations
    );

    expect(result).toBeDefined();
    expect(result).toHaveProperty('message', BACK_NOT_FOUND);
    expect(result).toHaveProperty('statusCode', 404);
  });
  test('should get BACK_NOT_FOUND err msg for delete', async () => {
    const result = await deleteBack(wrongId, operations);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('statusCode', 404);
  });
  test('should delete back', async () => {
    const result = await deleteBack(backId, operations);

    expect(result).toBeDefined();
  });
  afterAll(async () => {
    await deleteColor(colorId, operations);
    await deleteMaterial(materialId, operations);
  });
});
