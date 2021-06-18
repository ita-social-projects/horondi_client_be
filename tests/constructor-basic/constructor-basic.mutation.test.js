const mongoose = require('mongoose');
const { setupApp } = require('../helper-functions');
const { createMaterial } = require('../materials/material.helper');
const { createColor } = require('../color/color.helper');
const {
  deleteConstructorBasic,
  updateConstructorBasic,
  createConstructorBasic,
} = require('./constructor-basic.helper');
const {
  wrongId,
  newConstructorBasic,
  getConstructorData,
  getConstructorDataForUpt,
} = require('./constructor-basic.variables');
const { getMaterial } = require('../materials/material.variables');
const {
  CONSTRUCTOR_ELEMENT_NOT_FOUND,
} = require('../../error-messages/constructor-element-messages');
const { ITEM_ALREADY_EXISTS } = require('../../error-messages/common.messages');
const {
  STATUS_CODES: { BAD_REQUEST },
} = require('../../consts/status-codes');
const { color } = require('../color/color.variables');
const { createModel } = require('../model/model.helper');
const { newModel } = require('../model/model.variables');
const { createCategory } = require('../category/category.helper');
const { newCategoryInputData } = require('../category/category.variables');
const { createSize } = require('../size/size.helper');
const {
  SIZES_TO_CREATE: { size1 },
} = require('../size/size.variables');

let operations;
let colorId;
let materialInput;
let receivedMaterial;
let materialId;
let modelId;
let categoryId;
let sizeId;
let constructorInput;
let constructorBasicId;
let currentConstructorBasic = {};
let constructorUpdateInput;
let currentconstructorUpdate;

jest.mock('../../modules/currency/currency.utils.js');
jest.mock('../../modules/upload/upload.service.js');

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
    const sizeData = await createSize(size1, operations);
    sizeId = sizeData._id;
    const modelData = await createModel(
      newModel(categoryId, sizeId),
      operations
    );
    modelId = modelData._id;
    constructorInput = newConstructorBasic(materialId, colorId, modelId);

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
    currentConstructorBasic = getConstructorData(constructorInput, {
      materialId,
      colorId,
      modelId,
    });
  });

  test('#1 Should add Constructor Basic', async () => {
    const createConstructor = await createConstructorBasic(
      constructorInput,
      operations
    );

    constructorBasicId = createConstructor._id;

    expect(createConstructor).toBeDefined();
    expect(createConstructor).toEqual({
      ...currentConstructorBasic,
      _id: constructorBasicId,
    });
  });
  test('#3 ConstructorBasic should return Error item already exists', async () => {
    const createConstructor = await createConstructorBasic(
      constructorInput,
      operations
    );

    expect(createConstructor).toBeDefined();
    expect(createConstructor.message).toEqual(ITEM_ALREADY_EXISTS);
    expect(createConstructor.statusCode).toEqual(BAD_REQUEST);
  });
  test('#2 Should update existing constructorBasic', async () => {
    const updateConstructor = await updateConstructorBasic(
      constructorUpdateInput,
      constructorBasicId,
      operations
    );

    expect(updateConstructor).toBeDefined();
    expect(updateConstructor).toEqual({
      ...currentconstructorUpdate,
      _id: constructorBasicId,
    });
  });
  test('#4 UpdateConstructorBasic should return CONSTRUCTOR_ELEMENT_NOT_FOUND', async () => {
    const updateConstructor = await updateConstructorBasic(
      constructorInput,
      wrongId,
      operations
    );
    const result = updateConstructor.message;

    expect(result).toBe(CONSTRUCTOR_ELEMENT_NOT_FOUND);
  });
  test('#5 deleteConstructorBasic should return error CONSTRUCTOR_ELEMENT_NOT_FOUND', async () => {
    const deletedConstructor = await deleteConstructorBasic(
      wrongId,
      operations
    );

    expect(deletedConstructor.message).toBe(CONSTRUCTOR_ELEMENT_NOT_FOUND);
  });
  test('#6 Should delete constructor basic and return id', async () => {
    const deletedConstructor = await deleteConstructorBasic(
      constructorBasicId,
      operations
    );

    expect(deletedConstructor._id).toBe(constructorBasicId);
  });

  afterAll(async () => {
    mongoose.connection.db.dropDatabase();
  });
});
