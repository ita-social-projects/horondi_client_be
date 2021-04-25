const mongoose = require('mongoose');
const {
  createMaterial,
  deleteMaterial,
} = require('../materials/material.helper');
const { createColor, deleteColor } = require('../color/color.helper');
const { setupApp } = require('../helper-functions');
const { createConstructorBottom } = require('./constructor-bottom.helper');
const { getMaterial } = require('../materials/material.variables');
const { color, wrongId } = require('../color/color.variables');
const {
  newConstructorBottom,
  getConstructorData,
} = require('./constructor-bottom.variables');
const {
  getAllConstructorBottom,
  getConstructorBottomById,
  deleteConstructorBottom,
} = require('./constructor-bottom.helper');
const {
  CONSTRUCTOR_ELEMENT_NOT_FOUND,
} = require('../../error-messages/constructor-element-messages');
const {
  STATUS_CODES: { NOT_FOUND },
} = require('../../consts/status-codes');
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

let operations,
  constructorBottomId,
  colorId,
  sizeId,
  modelId,
  categoryId,
  materialInput,
  materialId,
  addConstructor,
  newConstructorForQuery,
  currentConstructorBottom;

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.utils.js');
jest.mock('../../modules/currency/currency.model.js');

describe('Constructor query', () => {
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
    addConstructor = newConstructorBottom(colorId, materialId, modelId);
    newConstructorForQuery = await createConstructorBottom(
      addConstructor,
      operations
    );
    constructorBottomId = newConstructorForQuery._id;
    currentConstructorBottom = getConstructorData(addConstructor, {
      materialId,
      colorId,
      modelId,
    });
    done();
  });
  test('should return all ConstructorBasics', async done => {
    const allConstructorBottom = await getAllConstructorBottom(operations);
    expect(allConstructorBottom).toBeDefined();
    expect(allConstructorBottom.length).toBeGreaterThan(0);
    done();
  });
  test('should return constructor-bottom by Id', async done => {
    const constructorBottomById = await getConstructorBottomById(
      newConstructorForQuery._id,
      operations
    );

    expect(constructorBottomById).toBeDefined();
    done();
  });
  test('should return error when try to get constructor-bottom by wrong ID', async done => {
    const constructorBottomById = await getConstructorBottomById(
      wrongId,
      operations
    );

    expect(constructorBottomById.message).toBe(CONSTRUCTOR_ELEMENT_NOT_FOUND);
    expect(constructorBottomById.statusCode).toBe(NOT_FOUND);
    done();
  });

  afterAll(async done => {
    mongoose.connection.db.dropDatabase(done);
  });
});
