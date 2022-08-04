const mongoose = require('mongoose');

const { setupApp } = require('../helper-functions');
const { STRAP_NOT_FOUND } = require('../../error-messages/strap.messages');
const { createStrap, getStrapById, getAllStraps } = require('./strap.helper');
const {
  wrongId,
  imgString,
  newImgObj,
  skip,
  filter,
  limit,
  wrongIdForError,
  newStrap,
  strapWithConvertedPrice,
} = require('./strap.variables');
const { createColor } = require('../color/color.helper');
const { color } = require('../color/color.variables');
const { createMaterial } = require('../materials/material.helper');
const { getMaterial } = require('../materials/material.variables');

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.utils.js');
jest.mock('../../modules/currency/currency.model.js');

let operations;
let strapId;
let colorId;
let materialInput;
let materialId;
let strapData;

describe('Strap queries', () => {
  beforeAll(async () => {
    operations = await setupApp();

    const colorData = await createColor(color, operations);
    colorId = colorData._id;
    materialInput = getMaterial(colorId);
    const materialData = await createMaterial(materialInput, operations);
    materialId = materialData._id;

    filter.color.push(colorId);
    filter.material.push(materialId);

    strapData = await createStrap(
      newStrap(colorId, materialId),
      imgString,
      operations
    );

    strapId = strapData._id;
  });

  test('#1. should receive strap by ID', async () => {
    const result = await getStrapById(strapId, operations);
    const convertedObj = await strapWithConvertedPrice(
      colorId,
      materialId,
      newImgObj
    );

    expect(result).toBeDefined();
    expect(result).toEqual({
      _id: strapId,
      ...convertedObj,
    });
  });

  test('#2. should throw Error STRAP_NOT_FOUND', async () => {
    const result = await getStrapById(wrongId, operations);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('message', STRAP_NOT_FOUND);
    expect(result).toHaveProperty('statusCode', 404);
  });

  test('#3. should receive All Straps with COLOR', async () => {
    const result = await getAllStraps(limit, skip, filter, operations);

    expect(result).toBeDefined();
    expect(result.items[0]).toHaveProperty('_id', strapId);
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items).toBeInstanceOf(Array);
  });

  test('#4. should receive All Straps', async () => {
    filter.color = [];
    const result = await getAllStraps(limit, skip, filter, operations);

    expect(result).toBeDefined();
    expect(result.items[0]).toHaveProperty('_id', strapId);
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items).toBeInstanceOf(Array);
  });

  test('#6. should receive Error when try getStrapById', async () => {
    const result = await getStrapById(wrongIdForError, operations);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('message');
    expect(result).toHaveProperty('statusCode');
  });
  afterAll(async () => {
    mongoose.connection.db.dropDatabase();
  });
});
