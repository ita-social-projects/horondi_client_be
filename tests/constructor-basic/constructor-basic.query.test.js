const mongoose = require('mongoose');
const { setupApp } = require('../helper-functions');
const { createColor } = require('../color/color.helper');
const { createMaterial } = require('../materials/material.helper');
const {
  createConstructorBasic,
  getAllConstructorBasics,
  getConstructorBasicById,
} = require('./constructor-basic.helper');
const {
  wrongId,
  filter,
  limit,
  skip,
  newConstructorBasic,
  getConstructorData,
} = require('./constructor-basic.variables');
const { getMaterial } = require('../materials/material.variables');
const {
  CONSTRUCTOR_ELEMENT_NOT_FOUND,
} = require('../../error-messages/constructor-element-messages');
const {
  STATUS_CODES: { NOT_FOUND },
} = require('../../consts/status-codes');
const { color } = require('../color/color.variables');
const { createModel } = require('../model/model.helper');
const { newModel } = require('../model/model.variables');
const { createCategory } = require('../category/category.helper');
const { newCategoryInputData } = require('../category/category.variables');
const { createSize } = require('../size/size.helper');
const {
  SIZES_TO_CREATE: { size1 },
  createPlainSize,
} = require('../size/size.variables');

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.utils.js');
jest.mock('../../modules/currency/currency.model.js');

let operations;
let materialId;
let receivedMaterial;
let materialInput;
let constructorInput;
let constructorBasic;
let constructorBasicId;
let currentConstructorBasic;
let colorId;
let modelId;
let categoryId;
let sizeId;

describe('constructor mutations', () => {
  beforeAll(async () => {
    operations = await setupApp();
    const colorData = await createColor(color, operations);
    colorId = colorData._id;
    materialInput = getMaterial(colorId);
    receivedMaterial = await createMaterial(materialInput, operations);
    materialId = receivedMaterial._id;
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
    constructorInput = newConstructorBasic(materialId, colorId, modelId);

    constructorBasic = await createConstructorBasic(
      constructorInput,
      operations
    );
    constructorBasicId = constructorBasic._id;

    currentConstructorBasic = getConstructorData(constructorInput, {
      materialId,
      colorId,
      modelId,
    });
  });

  test('#1 Should return all ConstructorBasics', async () => {
    const receivedAllConstructorBasics = await getAllConstructorBasics(
      { limit, skip, filter },
      operations
    );
    expect(receivedAllConstructorBasics.items).toBeDefined();
    expect(receivedAllConstructorBasics.items.length).toBeGreaterThan(0);
  });
  test('#2 Should return  ConstructorBasics by Id', async () => {
    const receivedById = await getConstructorBasicById(
      constructorBasicId,
      operations
    );
    expect(receivedById).toBeDefined();
    expect(receivedById).toEqual({
      ...currentConstructorBasic,
      _id: constructorBasicId,
    });
  });
  test('#3 Should return  Error', async () => {
    const receivedError = await getConstructorBasicById(wrongId, operations);

    expect(receivedError.statusCode).toBe(NOT_FOUND);
    expect(receivedError.message).toBe(CONSTRUCTOR_ELEMENT_NOT_FOUND);
  });

  afterAll(async () => {
    mongoose.connection.db.dropDatabase();
  });
});
