const mongoose = require('mongoose');

const { setupApp } = require('../helper-functions');
const { ITEM_ALREADY_EXISTS } = require('../../error-messages/common.messages');
const {
  createConstructorFrontPocket,
  deleteConstructorFrontPocket,
  updateConstructorFrontPocket,
} = require('./constructor.front.helper');

const {
  wrongId,
  newConstructorFront,
  getConstructorData,
  getConstructorDataForUpt,
} = require('./constructor.variables');
const { createColor } = require('../color/color.helper');
const { color } = require('../color/color.variables');
const { createMaterial } = require('../materials/material.helper');
const { getMaterial } = require('../materials/material.variables');
const {
  CONSTRUCTOR_ELEMENT_NOT_FOUND,
} = require('../../error-messages/constructor-element-messages');
const {
  STATUS_CODES: { BAD_REQUEST },
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
let categoryId;
let modelId;
let materialId;
let constructorInput;
let constructorFrontId;
let currentConstructorFront = {};
let constructorUpdateInput;
let currentconstructorUpdate;

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.utils.js');
jest.mock('../../modules/currency/currency.model.js');

describe('constructor mutations', () => {
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

    constructorInput = newConstructorFront(materialId, colorId, modelId);

    constructorUpdateInput = getConstructorDataForUpt(
      materialId,
      colorId,
      modelId
    );
    currentconstructorUpdate = getConstructorData(constructorUpdateInput, {
      materialId,
      colorId,
      modelId,
    });
    currentConstructorFront = getConstructorData(constructorInput, {
      materialId,
      colorId,
      modelId,
    });
  });

  test('#1 Should add Constructor Front Pocket', async () => {
    const createConstructor = await createConstructorFrontPocket(
      constructorInput,
      operations
    );
    constructorFrontId = createConstructor._id;

    expect(createConstructor).toBeDefined();
    expect(createConstructor).toEqual({
      ...currentConstructorFront,
      _id: constructorFrontId,
    });
  });
  test('#2 Constructor Front Pocket should return Error Constructor Front Pocket already exist', async () => {
    const error = await createConstructorFrontPocket(
      constructorInput,
      operations
    );

    expect(error).toBeDefined();
    expect(error.message).toEqual(ITEM_ALREADY_EXISTS);
    expect(error.statusCode).toEqual(BAD_REQUEST);
  });
  test('#3 Should update existing Constructor Front Pocket', async () => {
    const updateConstructor = await updateConstructorFrontPocket(
      constructorUpdateInput,
      constructorFrontId,
      operations
    );

    expect(updateConstructor).toBeDefined();
    expect(updateConstructor).toEqual({
      ...currentconstructorUpdate,
      _id: constructorFrontId,
    });
  });
  test('#4 Update Constructor Front Pocket should return CONSTRUCTOR_ELEMENT_NOT_FOUND', async () => {
    const result = await updateConstructorFrontPocket(
      constructorInput,
      wrongId,
      operations
    );

    expect(result.message).toBe(CONSTRUCTOR_ELEMENT_NOT_FOUND);
  });
  test('#5 delete Constructor Front Pocket should return error CONSTRUCTOR_ELEMENT_NOT_FOUND', async () => {
    const deletedConstructor = await deleteConstructorFrontPocket(
      wrongId,
      operations
    );
    const result = deletedConstructor.message;
    expect(result).toBe(CONSTRUCTOR_ELEMENT_NOT_FOUND);
  });
  test('#6 Should delete Constructor Front Pocket and return id', async () => {
    const deletedConstructor = await deleteConstructorFrontPocket(
      constructorFrontId,
      operations
    );
    const result = deletedConstructor._id;

    expect(result).toBe(constructorFrontId);
  });

  afterAll(async () => {
    mongoose.connection.db.dropDatabase();
  });
});
