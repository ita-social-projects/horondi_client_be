const mongoose = require('mongoose');

const { setupApp } = require('../helper-functions');
const { ITEM_ALREADY_EXISTS } = require('../../error-messages/common.messages');
const { BOTTOM_NOT_FOUND } = require('../../error-messages/bottom-messages');
const { deleteBottom, createBottom, updateBottom } = require('./bottom.helper');
const {
  wrongId,
  newBottomInputData,
  newBottomInputDataUpdate,
} = require('./bottom.variables');
const { createColor } = require('../color/color.helper');
const { color } = require('../color/color.variables');
const { createMaterial } = require('../materials/material.helper');
const { getMaterial } = require('../materials/material.variables');

let operations;
let bottomId;
let materialId;
let colorId;
let bottomInput;
let bottomUpdateInput;

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.model.js');
jest.mock('../../modules/currency/currency.utils.js');

describe('Bottom mutation tests', () => {
  beforeAll(async () => {
    operations = await setupApp();
    const colorData = await createColor(color, operations);
    colorId = colorData._id;

    const materialData = await createMaterial(getMaterial(colorId), operations);
    materialId = materialData._id;

    bottomInput = newBottomInputData(materialId, colorId);
    bottomUpdateInput = newBottomInputDataUpdate(materialId, colorId);
  });

  test('should create bottom', async () => {
    const createBottomTest = await createBottom(
      bottomInput,
      'image.jpg',
      operations
    );
    bottomId = createBottomTest._id;

    expect(createBottomTest).toBeDefined();
    expect(createBottomTest).toHaveProperty('available', bottomInput.available);
  });
  test('should get ITEM_ALREADY_EXISTS err msg for create', async () => {
    const result = await createBottom(bottomInput, 'image.jpg', operations);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('message', ITEM_ALREADY_EXISTS);
  });
  test('should update bottom', async () => {
    const updateBottomTest = await updateBottom(
      bottomId,
      bottomUpdateInput,
      'img-new.jpg',
      operations
    );

    expect(updateBottomTest).toBeDefined();
    expect(updateBottomTest).toHaveProperty('name', bottomUpdateInput.name);
  });
  test('should update bottom without adding image', async () => {
    const updateBottomTest = await updateBottom(
      bottomId,
      bottomUpdateInput,
      '',
      operations
    );

    expect(updateBottomTest).toBeDefined();
    expect(updateBottomTest).toHaveProperty('name', bottomUpdateInput.name);
  });
  test('delete bottom should return error BOTTOM_NOT_FOUND', async () => {
    const result = await deleteBottom(wrongId, operations);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('message', BOTTOM_NOT_FOUND);
    expect(result).toHaveProperty('statusCode', 404);
  });
  test('update bottom should return error BOTTOM_NOT_FOUND', async () => {
    const result = await updateBottom(
      wrongId,
      bottomUpdateInput,
      'img-new.jpg',
      operations
    );

    expect(result).toBeDefined();
    expect(result).toHaveProperty('message', BOTTOM_NOT_FOUND);
    expect(result).toHaveProperty('statusCode', 404);
  });
  test('should delete bottom', async () => {
    const deletedBottom = await deleteBottom(bottomId, operations);

    const result = deletedBottom._id;
    expect(result).toBe(bottomId);
  });
  test('should create bottom without image', async () => {
    const createBottomTest = await createBottom(bottomInput, '', operations);
    bottomId = createBottomTest._id;

    expect(createBottomTest).toBeDefined();
    expect(createBottomTest).toHaveProperty('available', bottomInput.available);
    expect(createBottomTest).toHaveProperty('name', bottomInput.name);
  });
  test('should update bottom without image', async () => {
    const updateBottomTest = await updateBottom(
      bottomId,
      bottomUpdateInput,
      '',
      operations
    );

    expect(updateBottomTest).toBeDefined();
    expect(updateBottomTest).toHaveProperty('name', bottomUpdateInput.name);
  });
  test('should delete bottom without image', async () => {
    const deletedBottom = await deleteBottom(bottomId, operations);

    const result = deletedBottom._id;
    expect(result).toBe(bottomId);
  });
  afterAll(async () => {
    mongoose.connection.db.dropDatabase();
  });
});
