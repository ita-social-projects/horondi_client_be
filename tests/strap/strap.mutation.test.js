const mongoose = require('mongoose');

const { setupApp } = require('../helper-functions');
const { STRAP_NOT_FOUND } = require('../../error-messages/strap.messages');
const { deleteStrap, createStrap, updateStrap } = require('./strap.helper');
const {
  wrongId,
  newImgString,
  imgString,
  wrongIdForError,
  wrongModelIdForError,
  newStrap,
  strapWithConvertedPrice,
  newStrapUpdated,
  newStrapUpdatedWithImage,
  strapToUpdate,
} = require('./strap.variables');
const { color } = require('../color/color.variables');
const { createColor } = require('../color/color.helper');
const { createModel } = require('../model/model.helper');
const { newModel } = require('../model/model.variables');
const { createCategory } = require('../category/category.helper');
const { newCategoryInputData } = require('../category/category.variables');
const { createSize } = require('../size/size.helper');
const { createPlainSize } = require('../size/size.variables');
const { ITEM_ALREADY_EXISTS } = require('../../error-messages/common.messages');

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.utils.js');
jest.mock('../../modules/currency/currency.model.js');

let operations;
let strapData;
let strapId;
let colorId;
let modelId;
let categoryId;
let sizeId;

describe('Strap mutations', () => {
  beforeAll(async () => {
    operations = await setupApp();

    const colorData = await createColor(color, operations);
    colorId = colorData._id;

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

    strapData = await createStrap(
      newStrap(colorId, modelId),
      imgString,
      operations
    );
    strapId = strapData._id;
  });

  test('#1. should create strap', async () => {
    const convertedObj = await strapWithConvertedPrice(
      colorId,
      modelId,
      newImgString
    );

    expect(strapData).toBeDefined();
    expect(strapData).toEqual({
      _id: strapId,
      ...convertedObj,
    });
  });

  test('#2. should receive Error STRAP_ALREADY_EXISTS when create strap', async () => {
    strapData = await createStrap(
      newStrap(colorId, modelId),
      newImgString,
      operations
    );

    expect(strapData).toBeDefined();
    expect(strapData).toHaveProperty('message', ITEM_ALREADY_EXISTS);
    expect(strapData).toHaveProperty('statusCode', 400);
  });

  test('#3. should receive Error STRAP_NOT_FOUND when update', async () => {
    strapData = await updateStrap(
      wrongId,
      strapToUpdate(colorId, modelId),
      null,
      operations
    );

    expect(strapData).toBeDefined();
    expect(strapData).toHaveProperty('message', STRAP_NOT_FOUND);
    expect(strapData).toHaveProperty('statusCode', 404);
  });

  test('#4. should update strap', async () => {
    const updatedStrap = await updateStrap(
      strapId,
      strapToUpdate(colorId, modelId),
      null,
      operations
    );

    const finalStrap = newStrapUpdated(colorId, modelId);

    expect(updatedStrap).toBeDefined();
    expect(updatedStrap).toEqual({
      _id: strapId,
      additionalPrice: finalStrap.additionalPrice,
      ...finalStrap,
    });
  });

  test('#5. should update strap with IMAGE', async () => {
    const updatedStrap = await updateStrap(
      strapId,
      strapToUpdate(colorId, modelId),
      newImgString,
      operations
    );

    const finalStrap = newStrapUpdatedWithImage(colorId, modelId, newImgString);

    expect(updatedStrap).toBeDefined();
    expect(updatedStrap).toEqual({
      _id: strapId,
      additionalPrice: finalStrap.additionalPrice,
      ...finalStrap,
    });
  });

  test('#6. should receive Error STRAP_NOT_FOUND when delete', async () => {
    strapData = await deleteStrap(wrongId, operations);

    expect(strapData).toBeDefined();
    expect(strapData).toHaveProperty('message', STRAP_NOT_FOUND);
    expect(strapData).toHaveProperty('statusCode', 404);
  });

  test('#7. should delete strap', async () => {
    strapData = await deleteStrap(strapId, operations);

    expect(strapData).toBeDefined();
    expect(strapData).toHaveProperty('_id', strapId);
  });

  test('#8. should return Error when try create strap', async () => {
    strapData = await deleteStrap(strapId, operations);
    const newStrapData = await createStrap(
      newStrap(colorId, wrongModelIdForError),
      null,
      operations
    );

    expect(newStrapData).toBeDefined();
    expect(newStrapData).toHaveProperty('message');
    expect(newStrapData).toHaveProperty('statusCode');
  });

  test('#9. should return Error when try update strap', async () => {
    const updatedStrap = await updateStrap(
      strapId,
      strapToUpdate(colorId, wrongModelIdForError),
      newImgString,
      operations
    );

    expect(updatedStrap).toBeDefined();
    expect(updatedStrap).toHaveProperty('message');
    expect(updatedStrap).toHaveProperty('statusCode');
  });

  test('#10. should Return error when try delete strap', async () => {
    strapData = await deleteStrap(wrongIdForError, operations);

    expect(strapData).toBeDefined();
    expect(strapData).toHaveProperty('message');
    expect(strapData).toHaveProperty('statusCode');
  });

  afterAll(async () => {
    mongoose.connection.db.dropDatabase();
  });
});
