const mongoose = require('mongoose');
const { setupApp } = require('../helper-functions');
const { CLOSURE_NOT_FOUND } = require('../../error-messages/closures.messages');
const {
  deleteClosure,
  createClosure,
  updateClosure,
} = require('./closure.helper');
const {
  wrongId,
  newClosure,
  closureWithConvertedPrice,
  newClosureUpdated,
  closureToUpdate,
} = require('./closure.variables');
const { getMaterial } = require('../materials/material.variables');
const { createMaterial } = require('../materials/material.helper');
const { color } = require('../color/color.variables');
const { createColor } = require('../color/color.helper');
const { createModel } = require('../model/model.helper');
const { newModel } = require('../model/model.variables');
const { createCategory } = require('../category/category.helper');
const { newCategoryInputData } = require('../category/category.variables');
const { createSize } = require('../size/size.helper');

const { createPlainSize } = require('../size/size.variables');
const { ITEM_ALREADY_EXISTS } = require('../../error-messages/common.messages');

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.utils.js');
jest.mock('../../modules/currency/currency.model.js');

let operations;
let closureData;
let closureId;
let materialId;
let colorId;
let modelId;
let categoryId;
let sizeId;

describe('Closure mutations', () => {
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
      operations
    );
    modelId = modelData._id;
    const sizeData = await createSize(
      createPlainSize(modelId).size1,
      operations
    );
    sizeId = sizeData._id;
    closureData = await createClosure(
      newClosure(materialId, colorId, modelId),
      operations
    );
    closureId = closureData._id;
  });

  test('should create closure', async () => {
    const convertedObj = await closureWithConvertedPrice(
      materialId,
      colorId,
      modelId
    );

    expect(closureData).toBeDefined();
    expect(closureData).toEqual({
      _id: closureId,
      ...convertedObj,
    });
  });
  test('should receive error CLOSURE_ALREADY_EXISTS when create closure', async () => {
    closureData = await createClosure(
      newClosure(materialId, colorId, modelId),
      operations
    );
    expect(closureData).toBeDefined();
    expect(closureData).toHaveProperty('message', ITEM_ALREADY_EXISTS);
    expect(closureData).toHaveProperty('statusCode', 400);
  });
  test('should receive error CLOSURE_NOT_FOUND when update', async () => {
    closureData = await updateClosure(
      wrongId,
      closureToUpdate(materialId, colorId, modelId),
      operations
    );

    expect(closureData).toBeDefined();
    expect(closureData).toHaveProperty('message', CLOSURE_NOT_FOUND);
    expect(closureData).toHaveProperty('statusCode', 404);
  });
  test('should update closure', async () => {
    const updatedClosure = await updateClosure(
      closureId,
      closureToUpdate(materialId, colorId, modelId),
      operations
    );

    const finalClosure = newClosureUpdated(materialId, colorId, modelId);

    expect(updatedClosure).toBeDefined();
    expect(updatedClosure).toEqual({
      _id: closureId,
      additionalPrice: finalClosure.additionalPrice,
      ...finalClosure,
    });
  });
  test('should receive error CLOSURE_NOT_FOUND when delete', async () => {
    closureData = await deleteClosure(wrongId, operations);

    expect(closureData).toBeDefined();
    expect(closureData).toHaveProperty('message', CLOSURE_NOT_FOUND);
    expect(closureData).toHaveProperty('statusCode', 404);
  });
  test('should delete closure', async () => {
    closureData = await deleteClosure(closureId, operations);

    expect(closureData).toBeDefined();
    expect(closureData).toHaveProperty('_id', closureId);
  });

  afterAll(async () => {
    mongoose.connection.db.dropDatabase();
  });
});
