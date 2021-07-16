const mongoose = require('mongoose');
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
const { createMaterial } = require('../materials/material.helper');
const { createColor } = require('../color/color.helper');
const { color } = require('../color/color.variables');
const { createModel } = require('../model/model.helper');
const { newModel } = require('../model/model.variables');
const { createCategory } = require('../category/category.helper');
const { newCategoryInputData } = require('../category/category.variables');

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.model.js');
jest.mock('../../modules/currency/currency.utils.js');

let operations;
let backId;
let materialId;
let colorId;
let categoryId;
let modelId;
let backInput;

describe('Closure queries', () => {
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

    backInput = newBackInputData(materialId, colorId, modelId);
  });

  test('should create back', async () => {
    const result = await createBack(backInput, operations);
    backId = result._id;

    expect(result).toBeDefined();
    expect(result).toHaveProperty('available', backInput.available);
    expect(result).toHaveProperty('name', backInput.name);
  });
  test('should get BACK_ALREADY_EXIST err msg for create', async () => {
    const result = await createBack(backInput, operations);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('message', BACK_ALREADY_EXIST);
    expect(result).toHaveProperty('statusCode', 400);
  });
  afterAll(async () => {
    mongoose.connection.db.dropDatabase();
  });
});
