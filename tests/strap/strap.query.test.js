const mongoose = require('mongoose');

const { setupApp } = require('../helper-functions');
const { STRAP_NOT_FOUND } = require('../../error-messages/strap.messages');
const {
  createStrap,
  getStrapById,
  getStrapsByModel,
  getAllStraps,
} = require('./strap.helper');
const {
  wrongId,
  imgString,
  newImgString,
  skip,
  filter,
  limit,
  wrongModelId,
  wrongIdForError,
  wrongModelIdForError,
  newStrap,
  strapWithConvertedPrice,
} = require('./strap.variables');
const { createColor } = require('../color/color.helper');
const { color } = require('../color/color.variables');
const { createModel } = require('../model/model.helper');
const { newModel } = require('../model/model.variables');
const { createCategory } = require('../category/category.helper');
const { newCategoryInputData } = require('../category/category.variables');
const { createSize } = require('../size/size.helper');
const {
  SIZES_TO_CREATE: { size1 },
  createPlainSize,
} = require('../size/size.variables');

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.utils.js');
jest.mock('../../modules/currency/currency.model.js');

let operations;
let strapId;
let colorId;
let modelId;
let categoryId;
let sizeId;
let strapData;

describe('Strap queries', () => {
  beforeAll(async () => {
    operations = await setupApp();

    const colorData = await createColor(color, operations);
    colorId = colorData._id;

    filter.color.push(colorId);

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

  test('#1. should receive strap by ID', async () => {
    const result = await getStrapById(strapId, operations);
    const convertedObj = await strapWithConvertedPrice(
      colorId,
      modelId,
      newImgString
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

  test('#3. should receive strap by Model', async () => {
    const result = await getStrapsByModel(modelId, operations);

    expect(result).toBeDefined();
    expect(result[0]).toHaveProperty('model');
    expect(result.length).toBeGreaterThan(0);
    expect(result).toBeInstanceOf(Array);
  });

  test('#4. should throw Error strap by Model STRAP_NOT_FOUND', async () => {
    const result = await getStrapsByModel(wrongModelId, operations);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('message', STRAP_NOT_FOUND);
    expect(result).toHaveProperty('statusCode', 404);
  });

  test('#5. should receive All Straps with COLOR', async () => {
    const result = await getAllStraps(limit, skip, filter, operations);

    expect(result).toBeDefined();
    expect(result.items[0]).toHaveProperty('_id', strapId);
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items).toBeInstanceOf(Array);
  });

  test('#6. should receive All Straps', async () => {
    filter.color = [];
    const result = await getAllStraps(limit, skip, filter, operations);

    expect(result).toBeDefined();
    expect(result.items[0]).toHaveProperty('_id', strapId);
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items).toBeInstanceOf(Array);
  });

  test('#7. should receive Error when try All Straps with COLOR', async () => {
    const filter = {};
    const result = await getAllStraps(limit, skip, filter, operations);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('message');
    expect(result).toHaveProperty('statusCode');
  });

  test('#8. should receive Error when try getStrapById', async () => {
    const result = await getStrapById(wrongIdForError, operations);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('message');
    expect(result).toHaveProperty('statusCode');
  });

  test('#9. should receive Error when try get strap by Model', async () => {
    const result = await getStrapsByModel(wrongModelIdForError, operations);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('message');
    expect(result).toHaveProperty('statusCode');
  });

  afterAll(async () => {
    mongoose.connection.db.dropDatabase();
  });
});
