const { setupApp } = require('../helper-functions');
const {
  CLOSURE_NOT_FOUND,
  CLOSURE_ALREADY_EXIST,
} = require('../../error-messages/closures.messages');
const {
  deleteClosure,
  createClosure,
  updateClosure,
} = require('./closure.helper');
const {
  wrongId,
  newClosure,
  newClosureUpdated,
} = require('./closure.variables');
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

describe('Closure mutations', () => {
  beforeAll(async () => {
    operations = await setupApp();
    const colorData = await createColor(color, operations);
    colorId = colorData._id;
    const materialData = await createMaterial(getMaterial(colorId), operations);
    materialId = materialData._id;
  });

  test('should create closure', async () => {
    const closureData = await createClosure(newClosure(materialId), operations);
    closureId = closureData._id;

    expect(closureData).toBeDefined();
    expect(closureData).toHaveProperty('name', newClosure(materialId).name);
    expect(closureData).toHaveProperty(
      'additionalPrice',
      newClosure(materialId).additionalPrice
    );
    expect(closureData).toHaveProperty(
      'available',
      newClosure(materialId).available
    );
  });
  test('should receive error CLOSURE_ALREADY_EXISTS when create closure', async () => {
    const closureData = await createClosure(newClosure(materialId), operations);

    expect(closureData).toBeDefined();
    expect(closureData).toHaveProperty('message', CLOSURE_ALREADY_EXIST);
    expect(closureData).toHaveProperty('statusCode', 400);
  });
  test('should receive error CLOSURE_NOT_FOUND when update', async () => {
    const closureData = await updateClosure(
      wrongId,
      newClosureUpdated(materialId),
      operations
    );

    expect(closureData).toBeDefined();
    expect(closureData).toHaveProperty('message', CLOSURE_NOT_FOUND);
    expect(closureData).toHaveProperty('statusCode', 404);
  });
  test('should update closure', async () => {
    const closureData = await updateClosure(
      closureId,
      newClosureUpdated(materialId),
      operations
    );

    expect(closureData).toBeDefined();
    expect(closureData).toHaveProperty(
      'name',
      newClosureUpdated(materialId).name
    );
    expect(closureData).toHaveProperty(
      'additionalPrice',
      newClosureUpdated(materialId).additionalPrice
    );
    expect(closureData).toHaveProperty(
      'available',
      newClosureUpdated(materialId).available
    );
  });
  test('should receive error CLOSURE_ALREADY_EXIST when update', async () => {
    const closureData = await updateClosure(
      closureId,
      newClosureUpdated(materialId),
      operations
    );

    expect(closureData).toBeDefined();
    expect(closureData).toHaveProperty('message', CLOSURE_ALREADY_EXIST);
    expect(closureData).toHaveProperty('statusCode', 400);
  });
  test('should receive error CLOSURE_NOT_FOUND when delete', async () => {
    const closureData = await deleteClosure(wrongId, operations);

    expect(closureData).toBeDefined();
    expect(closureData).toHaveProperty('message', CLOSURE_NOT_FOUND);
    expect(closureData).toHaveProperty('statusCode', 404);
  });
  test('should receive error CLOSURE_NOT_FOUND when delete', async () => {
    const closureData = await deleteClosure(closureId, operations);

    expect(closureData).toBeDefined();
    expect(closureData).toHaveProperty('_id', closureId);
  });

  afterAll(async () => {
    await deleteMaterial(materialId, operations);
    await deleteColor(colorId, operations);
  });
});
