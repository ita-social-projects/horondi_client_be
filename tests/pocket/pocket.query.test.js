const mongoose = require('mongoose');

const { setupApp } = require('../helper-functions');
const { POCKET_NOT_FOUND } = require('../../error-messages/pocket.messages');
const {
  createPocket,
  getAllPockets,
  getPocketById,
} = require('./pocket.helper');
const {
  wrongId,
  filter,
  newPocketInputData,
  limit,
  skip,
} = require('./pocket.variables');

let operations;
let pocketInput;
let pocketDataForQuery;

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.utils.js');
jest.mock('../../modules/currency/currency.model.js');

describe('pocket query test', () => {
  beforeAll(async () => {
    operations = await setupApp();
    pocketInput = newPocketInputData();
    pocketDataForQuery = await createPocket(pocketInput, 'img.jpg', operations);
  });

  test('should get all pockets', async () => {
    const result = await getAllPockets({ limit, skip, filter }, operations);

    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });

  test('GetAllPockets with empty filter', async () => {
    filter.name = '';
    const result = await getAllPockets({ limit, skip, filter }, operations);

    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });

  test('getAllPockets should return filtered name', async () => {
    filter.name = 'ліва';
    const result = await getAllPockets({ limit, skip, filter }, operations);

    expect(result).toBeDefined();
    expect(result.length).toBe(1);
  });

  test('should get pocket by id', async () => {
    const result = await getPocketById(pocketDataForQuery._id, operations);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('restriction', pocketInput.restriction);
    expect(result).toHaveProperty('name', pocketInput.name);
  });

  test('getPocketById should get pocket_NOT_FOUND error msg', async () => {
    const result = await getPocketById(wrongId, operations);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('message', POCKET_NOT_FOUND);
    expect(result).toHaveProperty('statusCode', 404);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
  });
});
