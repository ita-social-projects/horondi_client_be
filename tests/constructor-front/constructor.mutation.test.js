const { setupApp } = require('../helper-functions');
const {
  FRONT_POCKET_NOT_FOUND,
  FRONT_POCKET_ALREADY_EXIST,
} = require('../../error-messages/constructor-front-pocket-messages');

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
const { createColor, deleteColor } = require('../color/color.helper');
const { color } = require('../color/color.variables');
const {
  createMaterial,
  deleteMaterial,
} = require('../materials/material.helper');
const { getMaterial } = require('../materials/material.variables');
const {
  CONSTRUCTOR_ELEMENT_NOT_FOUND,
  CONSTRUCTOR_ELEMENT_ALREADY_EXIST,
} = require('../../error-messages/constructor-element-messages');
const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
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
  colorId,
  sizeId,
  categoryId,
  modelId,
  materialId,
  constructorInput,
  constructorFrontId,
  currentConstructorFront = {},
  constructorUpdateInput,
  currentconstructorUpdate;

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
    const sizeData = await createSize(size1, operations);
    sizeId = sizeData._id;
    const modelData = await createModel(
      newModel(categoryId, sizeId),
      operations
    );
    modelId = modelData._id;
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
    expect(error.message).toEqual(CONSTRUCTOR_ELEMENT_ALREADY_EXIST);
    expect(error.statusCode).toEqual(BAD_REQUEST);
  });
  test('#3 Should update existing Constructor Front Pocket ', async () => {
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
  test('#4 Update Constructor Front Pocket should return FRONT_POCKET_NOT_FOUND', async () => {
    const result = await updateConstructorFrontPocket(
      constructorInput,
      wrongId,
      operations
    );

    expect(result.message).toBe(CONSTRUCTOR_ELEMENT_NOT_FOUND);
  });
  test('#5 delete Constructor Front Pocket should return error FRONT_POCKET_NOT_FOUND', async () => {
    const deletedConstructor = await deleteConstructorFrontPocket(
      wrongId,
      operations
    );
    const result = deletedConstructor.data.deleteConstructorFrontPocket.message;
    expect(result).toBe(CONSTRUCTOR_ELEMENT_NOT_FOUND);
  });
  test('#6 Should delete Constructor Front Pocket and return id', async () => {
    const deletedConstructor = await deleteConstructorFrontPocket(
      constructorFrontId,
      operations
    );
    const result = deletedConstructor.data.deleteConstructorFrontPocket._id;

    expect(result).toBe(constructorFrontId);
  });

  afterAll(async () => {
    await deleteMaterial(materialId, operations);
    await deleteColor(colorId, operations);
    await deleteCategory(categoryId, operations);
    await deleteSize(sizeId, operations);
    await deleteModel(modelId, operations);
  });
});
