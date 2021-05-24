const mongoose = require('mongoose');
const {
  patternToUpdate,
  wrongId,
  mutationPatternToAdd,
  createdPattern,
  patternAfterUpdate,
  finalPrice,
} = require('./pattern.variables');
const {
  ITEM_ALREADY_EXISTS,
  ITEM_NOT_FOUND,
} = require('../../error-messages/common.messages');
const {
  PATTERN_ALREADY_EXIST,
  PATTERN_NOT_FOUND,
} = require('../../error-messages/pattern.messages');
const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');
const { setupApp } = require('../helper-functions');
const {
  createPattern,
  deletePattern,
  updatePattern,
} = require('./pattern.helper');
const { createColor, deleteColor } = require('../color/color.helper');
const { color } = require('../color/color.variables');
const {
  createMaterial,
  deleteMaterial,
} = require('../materials/material.helper');
const { getMaterial } = require('../materials/material.variables');
const { createModel, deleteModel } = require('../model/model.helper');
const { newModel } = require('../model/model.variables');
const {
  createCategory,
  deleteCategory,
} = require('../category/category.helper');
const { newCategoryInputData } = require('../category/category.variables');
const { createSize, deleteSize } = require('../size/size.helper');
const {
  SIZES_TO_CREATE: { size1 },
} = require('../size/size.variables');

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.utils.js');
jest.mock('../../modules/currency/currency.model.js');

let patternId,
  operations,
  sizeId,
  categoryId,
  modelId,
  materialId,
  colorId,
  patternData;

describe('Pattern Mutation Tests', () => {
  beforeAll(async () => {
    operations = await setupApp();
    const colorData = await createColor(color, operations);
    colorId = colorData._id;
    const materialData = await createMaterial(getMaterial(colorId), operations);
    materialId = materialData._id;
    const categoryData = await createCategory(newCategoryInputData, operations);
    categoryId = categoryData._id;
    const sizeData = await createSize(size1, operations);
    sizeId = sizeData._id;
    const modelData = await createModel(
      newModel(categoryId, sizeId),
      operations
    );
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

  afterAll(async done => {
    mongoose.connection.db.dropDatabase(done);
  });
});
