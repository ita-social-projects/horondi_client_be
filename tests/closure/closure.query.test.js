const { setupApp } = require('../helper-functions');
const { CLOSURE_NOT_FOUND } = require('../../error-messages/closures.messages');
const {
  deleteClosure,
  createClosure,
  getClosureById,
} = require('./closure.helper');
const { wrongId, newClosure } = require('./closure.variables');
const { getMaterial } = require('../materials/material.variables');
const {
  createMaterial,
  deleteMaterial,
} = require('../materials/material.helper');
const { color } = require('../color/color.variables');
const { createColor, deleteColor } = require('../color/color.helper');

jest.mock('../../modules/upload/upload.service');

let operations;
let colorId;
let materialId;
let closureId;

describe('Closure queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
    const colorData = await createColor(color, operations);
    colorId = colorData._id;
    const materialData = await createMaterial(getMaterial(colorId), operations);
    materialId = materialData._id;
    const closureData = await createClosure(newClosure(materialId), operations);
    closureId = closureData._id;
  });

  test('should receive closure by ID', async () => {
    const result = await getClosureById(closureId, operations);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('name', newClosure(materialId).name);
    expect(result).toHaveProperty(
      'additionalPrice',
      newClosure(materialId).additionalPrice
    );
    expect(result).toHaveProperty(
      'available',
      newClosure(materialId).available
    );
  });
  test('should throw error CLOSURE_NOT_FOUND', async () => {
    const result = await getClosureById(wrongId, operations);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('message', CLOSURE_NOT_FOUND);
    expect(result).toHaveProperty('statusCode', 404);
  });

  afterAll(async () => {
    await deleteClosure(closureId, operations);
    await deleteMaterial(materialId, operations);
    await deleteColor(colorId, operations);
  });
});
