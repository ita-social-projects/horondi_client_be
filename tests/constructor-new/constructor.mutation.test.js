const mongoose = require('mongoose');

const { setupApp } = require('../helper-functions');
const { ITEM_ALREADY_EXISTS } = require('../../error-messages/common.messages');
const {
  CONSTRUCTOR_NOT_FOUND,
} = require('../../error-messages/constructor.messages');
const {
  deleteConstructor,
  createConstructor,
  updateConstructor,
} = require('./constructor.helper');
const {
  wrongId,
  newConstructorInputData,
  newConstructorInputDataUpdate,
} = require('./constructor.variables');

let operations;
let constructorId;
let constructorInput;
let constructorUpdateInput;

jest.mock('../../modules/upload/upload.service');

describe('constructor mutation tests', () => {
  beforeAll(async () => {
    operations = await setupApp();

    constructorInput = newConstructorInputData();
    constructorUpdateInput = newConstructorInputDataUpdate();
  });

  test('should create constructor', async () => {
    const result = await createConstructor(
      constructorInput,
      'image.jpg',
      operations
    );

    constructorId = result._id;

    expect(result).toHaveProperty('name', constructorInput.name);
  });

  test('should get ITEM_ALREADY_EXISTS err msg for create', async () => {
    const result = await createConstructor(
      constructorInput,
      'image.jpg',
      operations
    );

    expect(result).toBeDefined();
    expect(result).toHaveProperty('message', ITEM_ALREADY_EXISTS);
  });

  test('should update constructor', async () => {
    const result = await updateConstructor(
      constructorId,
      constructorUpdateInput,
      'img-new.jpg',
      operations
    );

    expect(result).toHaveProperty('name', constructorUpdateInput.name);
  });

  test('should update constructor without adding image', async () => {
    const result = await updateConstructor(
      constructorId,
      constructorUpdateInput,
      '',
      operations
    );

    expect(result).toHaveProperty('name', constructorUpdateInput.name);
  });

  test('delete constructor should return error CONSTRUCTOR_NOT_FOUND', async () => {
    const result = await deleteConstructor(wrongId, operations);

    expect(result).toHaveProperty('message', CONSTRUCTOR_NOT_FOUND);
    expect(result).toHaveProperty('statusCode', 404);
  });

  test('update constructor should return error CONSTRUCTOR_NOT_FOUND', async () => {
    const result = await updateConstructor(
      wrongId,
      constructorUpdateInput,
      'img-new.jpg',
      operations
    );

    expect(result).toHaveProperty('message', CONSTRUCTOR_NOT_FOUND);
    expect(result).toHaveProperty('statusCode', 404);
  });

  test('should delete constructor', async () => {
    const result = await deleteConstructor(constructorId, operations);

    expect(result._id).toBe(constructorId);
  });

  test('should create constructor without image', async () => {
    const result = await createConstructor(constructorInput, '', operations);

    constructorId = result._id;

    expect(result).toHaveProperty('name', constructorInput.name);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
  });
});
