const mongoose = require('mongoose');
const {
  patternToUpdate,
  wrongId,
  mutationPatternToAdd,
  createdPattern,
  patternAfterUpdate,
  finalPrice,
} = require('./pattern.variables');
const { ITEM_ALREADY_EXISTS } = require('../../error-messages/common.messages');
const { PATTERN_NOT_FOUND } = require('../../error-messages/pattern.messages');
const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');
const { setupApp } = require('../helper-functions');
const {
  createPattern,
  deletePattern,
  updatePattern,
} = require('./pattern.helper');
const { createColor } = require('../color/color.helper');
const { color } = require('../color/color.variables');
const { createMaterial } = require('../materials/material.helper');
const { getMaterial } = require('../materials/material.variables');
const { createModel } = require('../model/model.helper');
const { newModel } = require('../model/model.variables');
const { createCategory } = require('../category/category.helper');
const { newCategoryInputData } = require('../category/category.variables');

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.utils.js');
jest.mock('../../modules/currency/currency.model.js');

let patternId;
let operations;
let categoryId;
let modelId;
let materialId;
let colorId;
let patternData;

describe('Pattern Mutation Tests', () => {
  beforeAll(async () => {
    operations = await setupApp();
    const colorData = await createColor(color, operations);
    colorId = colorData._id;
    const materialData = await createMaterial(getMaterial(colorId), operations);
    materialId = materialData._id;
    const categoryData = await createCategory(newCategoryInputData, operations);
    categoryId = categoryData._id;
    const modelData = await createModel(newModel(categoryId), operations);
    modelId = modelData._id;
    patternData = await createPattern(
      mutationPatternToAdd(materialId, modelId),
      operations
    );
    patternId = patternData._id;
  });

  test('#1 Should Add Pattern To Database', async () => {
    const newPattern = createdPattern(materialId, modelId);

    expect(patternData).toEqual({
      _id: patternId,
      additionalPrice: finalPrice,
      ...newPattern,
    });
  });

  test('#2 Should Return Error If We Try To Create Pattern With Name That Already Exists', async () => {
    const res = await createPattern(
      mutationPatternToAdd(materialId, modelId),
      operations
    );

    expect(res).toHaveProperty('message', ITEM_ALREADY_EXISTS);
    expect(res).toHaveProperty('statusCode', BAD_REQUEST);
  });

  test('#3 Should Update Pattern', async () => {
    const updatedPattern = await updatePattern(
      patternId,
      patternToUpdate(materialId, modelId),
      [{ file: 1 }, {}],
      operations
    );

    const updatedMockedItem = patternAfterUpdate(materialId, modelId);

    expect(updatedPattern).toBeDefined();
    expect(updatedPattern).toEqual({
      _id: patternId,
      ...updatedMockedItem,
    });
  });

  test('#4 Should Return Error If We Try To Update Pattern With Wrong Id', async () => {
    const res = await updatePattern(
      wrongId,
      patternToUpdate(materialId, modelId),
      [{ file: 1 }, {}],
      operations
    );

    expect(res.statusCode).toBe(NOT_FOUND);
    expect(res.message).toBe(PATTERN_NOT_FOUND);
  });

  test('#5 Should Delete Pattern From Database', async () => {
    const deletedData = await deletePattern(patternId, operations);

    expect(deletedData._id).toEqual(patternId);
  });

  test('#6 Should Return Error If We Try To Delete Not Existing Pattern', async () => {
    const res = await deletePattern(wrongId, operations);

    expect(res).toHaveProperty('statusCode', NOT_FOUND);
    expect(res).toHaveProperty('message', PATTERN_NOT_FOUND);
  });

  afterAll(async () => {
    mongoose.connection.db.dropDatabase();
  });
});
