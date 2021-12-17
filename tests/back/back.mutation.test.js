const mongoose = require('mongoose');

const { setupApp } = require('../helper-functions');
const { ITEM_ALREADY_EXISTS } = require('../../error-messages/common.messages');
const { BACK_NOT_FOUND } = require('../../consts/back-messages');
const { deleteBack, createBack, updateBack } = require('./back.helper');
const {
  wrongId,
  newBackInputData,
  newBackInputDataUpdate,
} = require('./back.variables');
const { createColor } = require('../color/color.helper');
const { color } = require('../color/color.variables');
const { createMaterial } = require('../materials/material.helper');
const { getMaterial } = require('../materials/material.variables');
const { createModel } = require('../model/model.helper');
const { newModel } = require('../model/model.variables');
const { createCategory } = require('../category/category.helper');
const { newCategoryInputData } = require('../category/category.variables');
const { createSize } = require('../size/size.helper');
const { createPlainSize } = require('../size/size.variables');

let operations;
let backId;
let materialId;
let colorId;
let categoryId;
let sizeId;
let modelId;
let backInput;
let backUpdateInput;

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.model.js');
jest.mock('../../modules/currency/currency.utils.js');

describe('Back mutation tests', () => {
  beforeAll(async () => {
    operations = await setupApp();
    const colorData = await createColor(color, operations);
    colorId = colorData._id;

    const materialData = await createMaterial(getMaterial(colorId), operations);
    materialId = materialData._id;

    const categoryData = await createCategory(newCategoryInputData, operations);
    categoryId = categoryData._id;

    const modelData = await createModel(
      newModel(categoryId, sizeId),
      operations,
    );
    modelId = modelData._id;

    const sizeData = await createSize(
      createPlainSize(modelId).size1,
      operations,
    );
    sizeId = sizeData._id;

    backInput = newBackInputData(materialId, colorId, modelId);
    backUpdateInput = newBackInputDataUpdate(materialId, colorId, modelId);
  });

  test('should create back', async () => {
    const createBackTest = await createBack(backInput, 'image.jpg', operations);
    backId = createBackTest._id;

    expect(createBackTest).toBeDefined();
    expect(createBackTest).toHaveProperty('available', backInput.available);
    expect(createBackTest).toHaveProperty('name', backInput.name);
  });
  test('should get ITEM_ALREADY_EXISTS err msg for create', async () => {
    const result = await createBack(backInput, 'image.jpg', operations);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('message', ITEM_ALREADY_EXISTS);
  });
  test('should update back', async () => {
    const updateBackTest = await updateBack(
      backId,
      backUpdateInput,
      'img-new.jpg',
      operations,
    );

    expect(updateBackTest).toBeDefined();
    expect(updateBackTest).toHaveProperty('name', backUpdateInput.name);
  });
  test('should update back without adding image', async () => {
    const updateBackTest = await updateBack(
      backId,
      backUpdateInput,
      '',
      operations,
    );

    expect(updateBackTest).toBeDefined();
    expect(updateBackTest).toHaveProperty('name', backUpdateInput.name);
  });
  test('delete back should return error BACK_NOT_FOUND', async () => {
    const result = await deleteBack(wrongId, operations);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('message', BACK_NOT_FOUND);
    expect(result).toHaveProperty('statusCode', 404);
  });
  test('update back should return error BACK_NOT_FOUND', async () => {
    const result = await updateBack(
      wrongId,
      backUpdateInput,
      'img-new.jpg',
      operations,
    );

    expect(result).toBeDefined();
    expect(result).toHaveProperty('message', BACK_NOT_FOUND);
    expect(result).toHaveProperty('statusCode', 404);
  });
  test('should delete back', async () => {
    const deletedBack = await deleteBack(backId, operations);

    const result = deletedBack._id;
    expect(result).toBe(backId);
  });
  test('should create back without image', async () => {
    const createBackTest = await createBack(backInput, '', operations);
    backId = createBackTest._id;

    expect(createBackTest).toBeDefined();
    expect(createBackTest).toHaveProperty('available', backInput.available);
    expect(createBackTest).toHaveProperty('name', backInput.name);
  });
  test('should update back without image', async () => {
    const updateBackTest = await updateBack(
      backId,
      backUpdateInput,
      '',
      operations,
    );

    expect(updateBackTest).toBeDefined();
    expect(updateBackTest).toHaveProperty('name', backUpdateInput.name);
  });
  test('should delete back without image', async () => {
    const deletedBack = await deleteBack(backId, operations);

    const result = deletedBack._id;
    expect(result).toBe(backId);
  });
  afterAll(async () => {
    mongoose.connection.db.dropDatabase();
  });
});
