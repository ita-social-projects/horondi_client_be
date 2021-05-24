const mongoose = require('mongoose');
const {
  createMaterial,
  deleteMaterial,
} = require('../materials/material.helper');
const { createColor, deleteColor } = require('../color/color.helper');
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
const {
  STATUS_CODES: { NOT_FOUND },
} = require('../../consts/status-codes');
const { createModel } = require('../model/model.helper');
const { newModel } = require('../model/model.variables');
const {
  createCategory,
  deleteCategory,
} = require('../category/category.helper');
const { newCategoryInputData } = require('../category/category.variables');
const { createSize } = require('../size/size.helper');
const {
  SIZES_TO_CREATE: { size1 },
} = require('../size/size.variables');

let operations,
  colorId,
  sizeId,
  categoryId,
  modelId,
  materialInput,
  materialId,
  addConstructor,
  constructorId,
  currentConstructorBottom,
  newDataConstructorBottom;

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.utils.js');
jest.mock('../../modules/currency/currency.model.js');

describe('Constructor mutations', () => {
  beforeAll(async done => {
    operations = await setupApp();
    const colorData = await createColor(color, operations);
    colorId = colorData._id;
    materialInput = getMaterial(colorId);
    const materialData = await createMaterial(materialInput, operations);
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
    done();
  });

  test('should create constructor-bottom', async done => {
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
    done();
  });

  test('should update existing constructor-bottom', async done => {
    const updatedData = await updateConstructorBottom(
      constructorId,
      newDataConstructorBottom,
      operations
    );

    expect(updatedData).toBeDefined();
    expect(updatedData.image).not.toEqual(currentConstructorBottom.image);
    done();
  });
  test('should return Error (already exist) when creating same constructor-bottom again', async done => {
    const createConstructorAgain = await createConstructorBottom(
      newDataConstructorBottom,
      operations
    );

    expect(createConstructorAgain.message).toBeDefined();
    expect(createConstructorAgain.message).toEqual(ITEM_ALREADY_EXISTS);
    done();
  });
  test('should return Error (not found) when updating not existing constructor-bottom', async done => {
    const updateConstructor = await updateConstructorBottom(
      wrongId,
      addConstructor,
      operations
    );

    expect(updateConstructor.message).toBe(CONSTRUCTOR_ELEMENT_NOT_FOUND);
    done();
  });

  test('should delete constructor-bottom and return id', async done => {
    const deletedConstructor = await deleteConstructorBottom(
      constructorId,
      operations
    );
    expect(deletedConstructor._id).toBe(constructorId);
    done();
  });

  afterAll(async done => {
    mongoose.connection.db.dropDatabase(done);
  });
});
