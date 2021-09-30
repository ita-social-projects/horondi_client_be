const {
  newModel,
  newModelUpdated,
  wrongId,
  notValidId,
} = require('./model.variables');
const {
  createModel,
  deleteModel,
  updateModel,
  addModelConstructorBasic,
  deleteModelConstructorBasic,
  addModelConstructorPattern,
  deleteModelConstructorPattern,
  addModelConstructorFrontPocket,
  deleteModelConstructorFrontPocket,
  addModelConstructorBottom,
  deleteModelConstructorBottom,
} = require('./model.helper');
const { createSize, deleteSize } = require('../size/size.helper');
const { createPlainSize } = require('../size/size.variables');
const { setupApp } = require('../helper-functions');
const {
  deleteCategory,
  createCategory,
} = require('../category/category.helper');
const { newCategoryInputData } = require('../category/category.variables');
const { createColor, deleteColor } = require('../color/color.helper');
const { color } = require('../color/color.variables');
const {
  createMaterial,
  deleteMaterial,
} = require('../materials/material.helper');
const { getMaterial } = require('../materials/material.variables');
const { ITEM_ALREADY_EXISTS } = require('../../error-messages/common.messages');
const {
  STATUS_CODES: { BAD_REQUEST, NOT_FOUND },
} = require('../../consts/status-codes');
const {
  createConstructorBasic,
  deleteConstructorBasic,
} = require('../constructor-basic/constructor-basic.helper');
const {
  createConstructorBottom,
  deleteConstructorBottom,
} = require('../constructor-bottom/constructor-bottom.helper');
const {
  createConstructorFrontPocket,
  deleteConstructorFrontPocket,
} = require('../constructor-front/constructor.front.helper');
const {
  newConstructorBasic,
} = require('../constructor-basic/constructor-basic.variables');
const {
  newConstructorBottom,
} = require('../constructor-bottom/constructor-bottom.variables');
const {
  newConstructorFront,
} = require('../constructor-front/constructor.variables');

const MODEL_NOT_FOUND = 'MODEL_NOT_FOUND';
const MODEL_NOT_VALID = 'MODEL_NOT_VALID';
let modelId;
let categoryId;
let operations;
let sizeId;
let colorId;
let materialId;
let constructorElementID;
let constructorElementIDBottom;
let constructorElementIDFrontPocket;
let constructorElementIDBasic;

jest.mock('../../modules/upload/__mocks__/upload.service.js');
jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.model.js');
jest.mock('../../modules/currency/currency.utils.js');

describe('Model mutations', () => {
  beforeAll(async () => {
    operations = await setupApp();
    const createdCategory = await createCategory(
      newCategoryInputData,
      operations
    );
    categoryId = createdCategory._id;
    const colorData = await createColor(color, operations);
    colorId = colorData._id;
    const materialData = await createMaterial(getMaterial(colorId), operations);
    materialId = materialData._id;
  });

  test('Should create model', async () => {
    const model = await createModel(newModel(categoryId, sizeId), operations);
    modelId = model._id;
    const createdSize = await createSize(
      createPlainSize(modelId).size1,
      operations
    );
    sizeId = createdSize._id;
    expect(model).toBeDefined();
    expect(model).toHaveProperty(
      'name',
      newModel(categoryId, sizeId).name.map(item => ({
        ...item,
      }))
    );
    expect(model).toHaveProperty(
      'description',
      newModel(categoryId, sizeId).description.map(item => ({
        ...item,
      }))
    );
  });
  test('Should throw error ITEM_ALREADY_EXISTS', async () => {
    const error = await createModel(newModel(categoryId, sizeId), operations);

    expect(error).toBeDefined();
    expect(error).toHaveProperty('statusCode', BAD_REQUEST);
    expect(error).toHaveProperty('message', ITEM_ALREADY_EXISTS);
  });
  test('Should throw error MODEL_NOT_FOUND', async () => {
    const error = await deleteModel(wrongId, operations);

    expect(error).toBeDefined();
    expect(error).toHaveProperty('message', MODEL_NOT_FOUND);
  });
  test('Should update model', async () => {
    const modelUpdate = await updateModel(
      modelId,
      newModelUpdated(categoryId, sizeId),
      operations
    );

    expect(modelUpdate).toBeDefined();
    expect(modelUpdate).toHaveProperty(
      'name',
      newModelUpdated(categoryId, sizeId).name.map(item => ({
        ...item,
      }))
    );
    expect(modelUpdate).toHaveProperty(
      'description',
      newModelUpdated(categoryId, sizeId).description.map(item => ({
        ...item,
      }))
    );
  });
  test('Should throw error MODEL_NOT_FOUND while updating', async () => {
    const error = await updateModel(
      wrongId,
      newModelUpdated(categoryId, sizeId),
      operations
    );

    expect(error.message).toBe(MODEL_NOT_FOUND);
    expect(error.statusCode).toBe(NOT_FOUND);
  });
  test('Should add ModelConstructorBasic', async () => {
    const constructorBasicData = await createConstructorBasic(
      newConstructorBasic(materialId, colorId, modelId),
      operations
    );
    constructorElementID = constructorBasicData._id;
    const result = await addModelConstructorBasic(
      modelId,
      constructorElementID,
      operations
    );

    expect(result).toBeDefined();
    expect(result).toHaveProperty('_id', modelId);
  });
  test('Should delete ModelConstructorBasic', async () => {
    const result = await deleteModelConstructorBasic(
      modelId,
      constructorElementID,
      operations
    );

    expect(result).toBeDefined();
    expect(result).toHaveProperty('_id', modelId);
  });
  test('Should throw error MODEL_NOT_VALID on addModelConstructorBasic', async () => {
    const error = await addModelConstructorBasic(
      notValidId,
      constructorElementID,
      operations
    );

    expect(error.message).toBe(MODEL_NOT_VALID);
    expect(error.statusCode).toBe(BAD_REQUEST);
  });
  test('Should throw error MODEL_NOT_VALID on deleteModelConstructorBasic', async () => {
    const error = await deleteModelConstructorBasic(
      notValidId,
      constructorElementID,
      operations
    );

    expect(error.message).toBe(MODEL_NOT_VALID);
    expect(error.statusCode).toBe(BAD_REQUEST);
  });
  test('Should add ModelConstructorPattern', async () => {
    const result = await addModelConstructorPattern(
      modelId,
      constructorElementID,
      operations
    );

    expect(result).toBeDefined();
    expect(result).toHaveProperty('_id', modelId);
  });
  test('Should delete ModelConstructorPattern', async () => {
    const result = await deleteModelConstructorPattern(
      modelId,
      constructorElementID,
      operations
    );

    expect(result).toBeDefined();
    expect(result).toHaveProperty('_id', modelId);
  });
  test('Should throw error MODEL_NOT_VALID on addModelConstructorPattern', async () => {
    const error = await addModelConstructorPattern(
      notValidId,
      constructorElementID,
      operations
    );

    expect(error.message).toBe(MODEL_NOT_VALID);
    expect(error.statusCode).toBe(BAD_REQUEST);
  });
  test('Should throw error MODEL_NOT_VALID on deleteModelConstructorPattern', async () => {
    const error = await deleteModelConstructorPattern(
      notValidId,
      constructorElementID,
      operations
    );

    expect(error.message).toBe(MODEL_NOT_VALID);
    expect(error.statusCode).toBe(BAD_REQUEST);
  });
  test('Should add ModelConstructorFrontPocket', async () => {
    const constructorFrontPocketData = await createConstructorFrontPocket(
      newConstructorFront(materialId, colorId, modelId),
      operations
    );
    constructorElementIDFrontPocket = constructorFrontPocketData._id;
    const result = await addModelConstructorFrontPocket(
      modelId,
      constructorElementIDFrontPocket,
      operations
    );

    expect(result).toBeDefined();
    expect(result).toHaveProperty('_id', modelId);
  });
  test('Should delete ModelConstructorFrontPocket', async () => {
    const result = await deleteModelConstructorFrontPocket(
      modelId,
      constructorElementIDFrontPocket,
      operations
    );

    expect(result).toBeDefined();
    expect(result).toHaveProperty('_id', modelId);
  });
  test('Should throw error MODEL_NOT_VALID on addModelConstructorFrontPocket', async () => {
    const error = await addModelConstructorFrontPocket(
      notValidId,
      constructorElementIDFrontPocket,
      operations
    );

    expect(error.message).toBe(MODEL_NOT_VALID);
    expect(error.statusCode).toBe(BAD_REQUEST);
  });
  test('Should throw error MODEL_NOT_VALID on deleteModelConstructorFrontPocket', async () => {
    const error = await deleteModelConstructorFrontPocket(
      notValidId,
      constructorElementIDFrontPocket,
      operations
    );

    expect(error.message).toBe(MODEL_NOT_VALID);
    expect(error.statusCode).toBe(BAD_REQUEST);
  });
  test('Should add ModelConstructorBottom', async () => {
    const constructorBottomData = await createConstructorBottom(
      newConstructorBottom(materialId, colorId, modelId),
      operations
    );
    constructorElementIDBottom = constructorBottomData._id;
    const result = await addModelConstructorBottom(
      modelId,
      constructorElementIDBottom,
      operations
    );

    expect(result).toBeDefined();
    expect(result).toHaveProperty('_id', modelId);
  });
  test('Should delete ModelConstructorBottom', async () => {
    const result = await deleteModelConstructorBottom(
      modelId,
      constructorElementIDBottom,
      operations
    );

    expect(result).toBeDefined();
    expect(result).toHaveProperty('_id', modelId);
  });
  test('Should throw error MODEL_NOT_VALID on addModelConstructorBottom', async () => {
    const error = await addModelConstructorBottom(
      notValidId,
      constructorElementIDBottom,
      operations
    );

    expect(error.message).toBe(MODEL_NOT_VALID);
    expect(error.statusCode).toBe(BAD_REQUEST);
  });
  test('Should throw error MODEL_NOT_VALID on deleteModelConstructorBottom', async () => {
    const error = await deleteModelConstructorBottom(
      notValidId,
      constructorElementIDBottom,
      operations
    );

    expect(error.message).toBe(MODEL_NOT_VALID);
    expect(error.statusCode).toBe(BAD_REQUEST);
  });
  test('Should delete model', async () => {
    const modelDelete = await deleteModel(modelId, operations);

    expect(modelDelete).toBeDefined();
    expect(modelDelete._id).toEqual(modelId);
  });
  afterAll(async () => {
    await deleteCategory(categoryId, operations);
    await deleteSize(sizeId, operations);
    await deleteModel(modelId, operations);
    await deleteColor(colorId, operations);
    await deleteMaterial(materialId, operations);
    await deleteConstructorBottom(constructorElementIDBottom, operations);
    await deleteConstructorFrontPocket(
      constructorElementIDFrontPocket,
      operations
    );
    await deleteConstructorBasic(constructorElementIDBasic, operations);
  });
});
