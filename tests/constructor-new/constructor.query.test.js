const mongoose = require('mongoose');

const { setupApp } = require('../helper-functions');
const {
  CONSTRUCTOR_NOT_FOUND,
} = require('../../error-messages/constructor.messages');
const {
  createConstructor,
  getAllConstructors,
  getConstructorById,
  getConstructorByModel,
} = require('./constructor.helper');
const {
  newConstructorInputData,
  wrongId,
  filter,
  limit,
  skip,
} = require('./constructor.variables');

let operations;
let constructorDataForQuery;
let constructorInput;

jest.mock('../../modules/upload/upload.service');

describe('Constructor query test', () => {
  beforeAll(async () => {
    operations = await setupApp();
    constructorInput = newConstructorInputData();

    constructorDataForQuery = await createConstructor(
      constructorInput,
      'img.jpg',
      operations
    );
  });

  it('should get all constructors', async () => {
    const [result] = await getAllConstructors(
      { limit, skip, filter },
      operations
    );

    expect(result).toHaveProperty('name', constructorInput.name);
  });

  it('should get all constructors with filtered name', async () => {
    filter.name = 'some constructor';

    const result = await getAllConstructors(
      { limit, skip, filter },
      operations
    );

    expect(result.length).toBe(1);
  });

  it('should get constructor by id', async () => {
    const result = await getConstructorById(
      constructorDataForQuery._id,
      operations
    );

    expect(result).toHaveProperty('name', constructorInput.name);
  });

  it('should not get constructor by wrong model id', async () => {
    const result = await getConstructorByModel(wrongId, operations);

    expect(result).toHaveProperty('message', CONSTRUCTOR_NOT_FOUND);
  });

  it('should throw CONSTRUCTOR_NOT_FOUND error msg', async () => {
    const result = await getConstructorById(wrongId, operations);

    expect(result).toHaveProperty('message', CONSTRUCTOR_NOT_FOUND);
    expect(result).toHaveProperty('statusCode', 404);
  });

  afterAll(async () => {
    mongoose.connection.db.dropDatabase();
  });
});
