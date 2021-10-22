const mongoose = require('mongoose');

const { setupApp } = require('../helper-functions');
const { STRAP_NOT_FOUND } = require('../../error-messages/strap.messages');
const { deleteStrap, createStrap, updateStrap } = require('./strap.helper');
const {
  wrongId,
  newImgString,
  imgString,
  newImgObj,
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
const { ITEM_ALREADY_EXISTS } = require('../../error-messages/common.messages');

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.utils.js');
jest.mock('../../modules/currency/currency.model.js');

let operations;
let strapData;
let strapId;
let colorId;
let modelId;

describe('Strap mutations', () => {
  beforeAll(async () => {
    operations = await setupApp();

    const colorData = await createColor(color, operations);
    colorId = colorData._id;
    strapData = await createStrap(newStrap(colorId), imgString, operations);
    strapId = strapData._id;
  });

  test('#1. should create strap', async () => {
    const convertedObj = await strapWithConvertedPrice(colorId, newImgObj);

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

    const finalStrap = newStrapUpdatedWithImage(colorId, modelId, newImgObj);

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

  test('#8. should return Error when try update strap', async () => {
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

  test('#9. should Return error when try delete strap', async () => {
    strapData = await deleteStrap(wrongIdForError, operations);

    expect(strapData).toBeDefined();
    expect(strapData).toHaveProperty('message');
    expect(strapData).toHaveProperty('statusCode');
  });

  afterAll(async () => {
    mongoose.connection.db.dropDatabase();
  });
});
