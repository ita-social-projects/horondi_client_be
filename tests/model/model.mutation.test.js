const mongoose = require('mongoose');

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
  addModelConstructorBottom,
  deleteModelConstructorBottom,
  getModelById,
} = require('./model.helper');
const { createProduct } = require('../product/product.helper');
const { newProductInputData } = require('../product/product.variables');
const { createClosure } = require('../closure/closure.helper');
const { createPattern } = require('../pattern/pattern.helper');
const { queryPatternToAdd } = require('../pattern/pattern.variables');
const { newClosure } = require('../closure/closure.variables');
const { setupApp } = require('../helper-functions');
const { createCategory } = require('../category/category.helper');
const { newCategoryInputData } = require('../category/category.variables');
const { createColor } = require('../color/color.helper');
const { color } = require('../color/color.variables');
const { createMaterial } = require('../materials/material.helper');
const { getMaterial } = require('../materials/material.variables');
const { ITEM_ALREADY_EXISTS } = require('../../error-messages/common.messages');
const {
  STATUS_CODES: { BAD_REQUEST, NOT_FOUND },
} = require('../../consts/status-codes');
const {
  createConstructorBasic,
} = require('../constructor-basic/constructor-basic.helper');
const {
  createConstructorBottom,
} = require('../constructor-bottom/constructor-bottom.helper');
const {
  newConstructorBasic,
} = require('../constructor-basic/constructor-basic.variables');
const {
  newConstructorBottom,
} = require('../constructor-bottom/constructor-bottom.variables');
const modelService = require('../../modules/model/model.service');

const MODEL_NOT_FOUND = 'MODEL_NOT_FOUND';
const MODEL_NOT_VALID = 'MODEL_NOT_VALID';
let modelId;
let categoryId;
let operations;
let colorId;
let materialId;
let constructorElementID;
let constructorElementIDBottom;

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
    const model = await createModel(newModel(categoryId), operations);

    modelId = model._id;

    expect(model).toHaveProperty(
      'name',
      newModel(categoryId).name.map(item => ({
        ...item,
      }))
    );
    expect(model).toHaveProperty(
      'description',
      newModel(categoryId).description.map(item => ({
        ...item,
      }))
    );
  });
  test('Should throw error ITEM_ALREADY_EXISTS', async () => {
    const error = await createModel(newModel(categoryId), operations);

    expect(error).toHaveProperty('statusCode', BAD_REQUEST);
    expect(error).toHaveProperty('message', ITEM_ALREADY_EXISTS);
  });
  test('Should throw error MODEL_NOT_FOUND', async () => {
    const error = await deleteModel(wrongId, operations);

    expect(error).toHaveProperty('message', MODEL_NOT_FOUND);
  });
  test('Should update model', async () => {
    const modelUpdate = await updateModel(
      modelId,
      newModelUpdated(categoryId),
      operations
    );
    expect(modelUpdate).toHaveProperty(
      'name',
      newModelUpdated(categoryId).name.map(item => ({
        ...item,
      }))
    );
    expect(modelUpdate).toHaveProperty(
      'description',
      newModelUpdated(categoryId).description.map(item => ({
        ...item,
      }))
    );
  });
  test('Should throw error MODEL_NOT_FOUND while updating', async () => {
    const error = await updateModel(
      wrongId,
      newModelUpdated(categoryId),
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

    expect(result).toHaveProperty('_id', modelId);
  });
  test('Should delete ModelConstructorPattern', async () => {
    const result = await deleteModelConstructorPattern(
      modelId,
      constructorElementID,
      operations
    );

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

    expect(result).toHaveProperty('_id', modelId);
  });
  test('Should delete ModelConstructorBottom', async () => {
    const result = await deleteModelConstructorBottom(
      modelId,
      constructorElementIDBottom,
      operations
    );

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

    expect(modelDelete._id).toEqual(modelId);
  });

  test('Should get a size from the model by its id', async () => {
    const modelInstance = newModel(categoryId);
    const model = await createModel(modelInstance, operations);

    const sizeById = await modelService.getModelSizeById(
      model._id,
      model.sizes[0]._id
    );
    delete sizeById._id;

    await deleteModel(model._id, operations);
    expect(sizeById).toEqual(modelInstance.sizes[0]);
  });

  test('Should get model sizes filtered by given size IDs', async () => {
    const model = await createModel(newModel(categoryId), operations);
    const sizeIDs = [model.sizes[0]._id.toString()];

    const sizes = modelService.getModelSizes(model, sizeIDs);

    await deleteModel(model._id, operations);
    expect(sizes[0]._id.toString()).toBe(sizeIDs[0]);
  });

  test('Should perform soft deletion on the model', async () => {
    const model = await createModel(newModel(categoryId), operations);
    const { _id: patternId } = await createPattern(
      queryPatternToAdd(materialId, modelId),
      operations
    );
    const { _id: closureId } = await createClosure(
      newClosure(materialId, colorId, modelId),
      operations
    );
    const productInput = newProductInputData(
      categoryId,
      model._id,
      materialId,
      materialId,
      colorId,
      patternId,
      closureId,
      model.sizes[0]._id
    );
    await createProduct(productInput, operations);
    await deleteModel(model._id, operations);
    const deletedModel = await getModelById(model._id, operations);

    expect(deletedModel.isDeleted).toBe(true);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
  });
});
