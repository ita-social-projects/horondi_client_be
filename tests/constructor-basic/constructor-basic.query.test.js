const mongoose = require('mongoose');
const { setupApp } = require('../helper-functions');
const { createColor, deleteColor } = require('../color/color.helper');
const {
  createMaterial,
  deleteMaterial,
} = require('../materials/material.helper');
const {
  createConstructorBasic,
  getAllConstructorBasics,
  getConstructorBasicById,
  deleteConstructorBasic,
} = require('./constructor-basic.helper');
const {
  wrongId,
  filter,
  limit,
  skip,
  newConstructorBasic,
  getConstructorData,
} = require('./constructor-basic.variables');
const {
  getMaterial,
  getMaterialToUpdate,
} = require('../materials/material.variables');
const {
  CONSTRUCTOR_ELEMENT_NOT_FOUND,
} = require('../../error-messages/constructor-element-messages');
const {
  STATUS_CODES: { NOT_FOUND },
} = require('../../consts/status-codes');
const { color } = require('../color/color.variables');
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

let operations,
  materialId,
  receivedMaterial,
  materialInput,
  constructorInput,
  constructorBasic,
  constructorBasicId,
  currentConstructorBasic,
  colorId,
  modelId,
  categoryId,
  sizeId;

describe('constructor mutations', () => {
  beforeAll(async done => {
    operations = await setupApp();
    const colorData = await createColor(color, operations);
    colorId = colorData._id;
    materialInput = getMaterial(colorId);
    receivedMaterial = await createMaterial(materialInput, operations);
    materialId = receivedMaterial._id;
    const categoryData = await createCategory(newCategoryInputData, operations);
    categoryId = categoryData._id;
    const sizeData = await createSize(size1, operations);
    sizeId = sizeData._id;
    const modelData = await createModel(
      newModel(categoryId, sizeId),
      operations
    );
    modelId = modelData._id;
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
    done();
  });

  test('#1 Should return all ConstructorBasics', async done => {
    const receivedAllConstructorBasics = await getAllConstructorBasics(
      { limit, skip, filter },
      operations
    );
    expect(receivedAllConstructorBasics.items).toBeDefined();
    expect(receivedAllConstructorBasics.items.length).toBeGreaterThan(0);
    done();
  });
  test('#2 Should return  ConstructorBasics by Id', async done => {
    const receivedById = await getConstructorBasicById(
      constructorBasicId,
      operations
    );
    expect(receivedById).toBeDefined();
    expect(receivedById).toEqual({
      ...currentConstructorBasic,
      _id: constructorBasicId,
    });
    done();
  });
  test('#3 Should return  Error', async done => {
    const receivedError = await getConstructorBasicById(wrongId, operations);

    expect(receivedError.statusCode).toBe(NOT_FOUND);
    expect(receivedError.message).toBe(CONSTRUCTOR_ELEMENT_NOT_FOUND);
    done();
  });

  afterAll(async done => {
    mongoose.connection.db.dropDatabase(done);
  });
});
