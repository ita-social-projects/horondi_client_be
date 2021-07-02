const mongoose = require('mongoose');
const { createMaterial } = require('../materials/material.helper');
const { createColor } = require('../color/color.helper');
const { setupApp } = require('../helper-functions');
const { createConstructorBottom } = require('./constructor-bottom.helper');
const { getMaterial } = require('../materials/material.variables');
const { color, wrongId } = require('../color/color.variables');
const {
  newConstructorBottom,
  filter,
  limit,
  skip,
} = require('./constructor-bottom.variables');
const {
  getAllConstructorBottom,
  getConstructorBottomById,
} = require('./constructor-bottom.helper');
const {
  CONSTRUCTOR_ELEMENT_NOT_FOUND,
} = require('../../error-messages/constructor-element-messages');
const {
  STATUS_CODES: { NOT_FOUND },
} = require('../../consts/status-codes');
const { createModel } = require('../model/model.helper');
const { newModel } = require('../model/model.variables');
const { createCategory } = require('../category/category.helper');
const { newCategoryInputData } = require('../category/category.variables');
const { createSize } = require('../size/size.helper');
const {
  SIZES_TO_CREATE: { size1 },
  createPlainSize,
} = require('../size/size.variables');

let operations;
let colorId;
let sizeId;
let modelId;
let categoryId;
let materialInput;
let materialId;
let addConstructor;
let newConstructorForQuery;

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.utils.js');
jest.mock('../../modules/currency/currency.model.js');

describe('Constructor query', () => {
  beforeAll(async () => {
    operations = await setupApp();
    const colorData = await createColor(color, operations);
    colorId = colorData._id;
    materialInput = getMaterial(colorId);
    const materialData = await createMaterial(materialInput, operations);
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
    addConstructor = newConstructorBottom(colorId, materialId, modelId);
    newConstructorForQuery = await createConstructorBottom(
      addConstructor,
      operations
    );
  });

  test('should return all ConstructorBasics', async () => {
    const allConstructorBottom = await getAllConstructorBottom(
      { limit, skip, filter },
      operations
    );
    expect(allConstructorBottom).toBeDefined();
    expect(allConstructorBottom.length).toBeGreaterThan(0);
  });
  test('should return constructor-bottom by Id', async () => {
    const constructorBottomById = await getConstructorBottomById(
      newConstructorForQuery._id,
      operations
    );

    expect(constructorBottomById).toBeDefined();
  });
  test('should return error when try to get constructor-bottom by wrong ID', async () => {
    const constructorBottomById = await getConstructorBottomById(
      wrongId,
      operations
    );

    expect(constructorBottomById.message).toBe(CONSTRUCTOR_ELEMENT_NOT_FOUND);
    expect(constructorBottomById.statusCode).toBe(NOT_FOUND);
  });

  afterAll(async () => {
    mongoose.connection.db.dropDatabase();
  });
});
