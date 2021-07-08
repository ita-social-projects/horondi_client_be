const mongoose = require('mongoose');
const { createMaterial } = require('../materials/material.helper');
const { createColor } = require('../color/color.helper');
const { getMaterial } = require('../materials/material.variables');
const { color, wrongId } = require('../color/color.variables');
const { setupApp } = require('../helper-functions');
const { ITEM_ALREADY_EXISTS } = require('../../error-messages/common.messages');
const {
  createConstructorBottom,
  updateConstructorBottom,
  deleteConstructorBottom,
} = require('./constructor-bottom.helper');
const {
  newConstructorBottom,
  getConstructorData,
  getConstructorDataForUpt,
} = require('./constructor-bottom.variables');
const {
  CONSTRUCTOR_ELEMENT_NOT_FOUND,
} = require('../../error-messages/constructor-element-messages');

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
let materialInput;
let materialId;
let addConstructor;
let constructorId;
let currentConstructorBottom;
let newDataConstructorBottom;

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.utils.js');
jest.mock('../../modules/currency/currency.model.js');

describe('Constructor mutations', () => {
  beforeAll(async () => {
    operations = await setupApp();
    const colorData = await createColor(color, operations);
    colorId = colorData._id;
    materialInput = getMaterial(colorId);
    const materialData = await createMaterial(materialInput, operations);
    materialId = materialData._id;
    const categoryData = await createCategory(newCategoryInputData, operations);
    categoryId = categoryData._id;

    const modelData = await createModel(newModel(categoryId), operations);
    modelId = modelData._id;

    addConstructor = newConstructorBottom(materialId, colorId, modelId);
    currentConstructorBottom = getConstructorData(addConstructor, {
      materialId,
      colorId,
      modelId,
    });
    newDataConstructorBottom = getConstructorDataForUpt(
      materialId,
      colorId,
      modelId
    );
  });

  test('should create constructor-bottom', async () => {
    const createConstructorBottomData = await createConstructorBottom(
      addConstructor,
      operations
    );
    constructorId = createConstructorBottomData._id;

    expect(createConstructorBottomData).toBeDefined();
    expect(createConstructorBottomData).toEqual({
      ...currentConstructorBottom,
      _id: constructorId,
    });
  });

  test('should update existing constructor-bottom', async () => {
    const updatedData = await updateConstructorBottom(
      constructorId,
      newDataConstructorBottom,
      operations
    );

    expect(updatedData).toBeDefined();
    expect(updatedData.image).not.toEqual(currentConstructorBottom.image);
  });
  test('should return Error (already exist) when creating same constructor-bottom again', async () => {
    const createConstructorAgain = await createConstructorBottom(
      newDataConstructorBottom,
      operations
    );

    expect(createConstructorAgain.message).toBeDefined();
    expect(createConstructorAgain.message).toEqual(ITEM_ALREADY_EXISTS);
  });
  test('should return Error (not found) when updating not existing constructor-bottom', async () => {
    const updateConstructor = await updateConstructorBottom(
      wrongId,
      addConstructor,
      operations
    );

    expect(updateConstructor.message).toBe(CONSTRUCTOR_ELEMENT_NOT_FOUND);
  });

  test('should delete constructor-bottom and return id', async () => {
    const deletedConstructor = await deleteConstructorBottom(
      constructorId,
      operations
    );
    expect(deletedConstructor._id).toBe(constructorId);
  });

  afterAll(async () => {
    mongoose.connection.db.dropDatabase();
  });
});
