const mongoose = require('mongoose');

const { setupApp } = require('../helper-functions');
const { ITEM_ALREADY_EXISTS } = require('../../error-messages/common.messages');
const { POCKET_NOT_FOUND } = require('../../error-messages/pocket.messages');
const { deletePocket, createPocket, updatePocket } = require('./pocket.helper');
const {
  wrongId,
  newPocketInputData,
  newPocketInputDataUpdate,
} = require('./pocket.variables');

let operations;
let pocketId;
let pocketInput;
let pocketUpdateInput;

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.model.js');
jest.mock('../../modules/currency/currency.utils.js');

describe('pocket mutation tests', () => {
  beforeAll(async () => {
    operations = await setupApp();
    pocketInput = newPocketInputData();
    pocketUpdateInput = newPocketInputDataUpdate();
  });

  test('should create pocket', async () => {
    const createPocketTest = await createPocket(
      pocketInput,
      'image.jpg',
      operations
    );
    pocketId = createPocketTest._id;

    expect(createPocketTest).toBeDefined();
    expect(createPocketTest).toHaveProperty(
      'restriction',
      pocketInput.restriction
    );
    expect(createPocketTest).toHaveProperty('name', pocketInput.name);
  });

  test('should get ITEM_ALREADY_EXISTS err msg for create', async () => {
    const result = await createPocket(pocketInput, 'image.jpg', operations);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('message', ITEM_ALREADY_EXISTS);
  });

  test('should update pocket', async () => {
    const updatePocketTest = await updatePocket(
      pocketId,
      pocketUpdateInput,
      'img-new.jpg',
      operations
    );
    expect(updatePocketTest).toBeDefined();
    expect(updatePocketTest).toHaveProperty('name', pocketUpdateInput.name);
  });

  test('should update pocket without adding image', async () => {
    const updatePocketTest = await updatePocket(
      pocketId,
      pocketUpdateInput,
      '',
      operations
    );
    expect(updatePocketTest).toBeDefined();
    expect(updatePocketTest).toHaveProperty('name', pocketUpdateInput.name);
  });

  test('delete pocket should return error pocket_NOT_FOUND', async () => {
    const result = await deletePocket(wrongId, operations);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('message', POCKET_NOT_FOUND);
    expect(result).toHaveProperty('statusCode', 404);
  });

  test('update pocket should return error pocket_NOT_FOUND', async () => {
    const result = await updatePocket(
      wrongId,
      pocketUpdateInput,
      'img-new.jpg',
      operations
    );

    expect(result).toBeDefined();
    expect(result).toHaveProperty('message', POCKET_NOT_FOUND);
    expect(result).toHaveProperty('statusCode', 404);
  });

  test('should delete pocket', async () => {
    const deletedPocket = await deletePocket(pocketId, operations);

    const result = deletedPocket._id;
    expect(result).toBe(pocketId);
  });

  test('should create pocket without image', async () => {
    const createPocketTest = await createPocket(pocketInput, '', operations);
    pocketId = createPocketTest._id;

    expect(createPocketTest).toBeDefined();
    expect(createPocketTest).toHaveProperty('available', pocketInput.available);
    expect(createPocketTest).toHaveProperty('name', pocketInput.name);
  });

  test('should update pocket without image', async () => {
    const updatePocketTest = await updatePocket(
      pocketId,
      pocketUpdateInput,
      '',
      operations
    );

    expect(updatePocketTest).toBeDefined();
    expect(updatePocketTest).toHaveProperty('name', pocketUpdateInput.name);
  });

  test('should delete pocket without image', async () => {
    const deletedPocket = await deletePocket(pocketId, operations);

    const result = deletedPocket._id;
    expect(result).toBe(pocketId);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
  });
});
