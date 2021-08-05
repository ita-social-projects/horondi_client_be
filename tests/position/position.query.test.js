const mongoose = require('mongoose');

const { setupApp } = require('../helper-functions');
const {
  createPosition,
  getAllPositions,
  getPositionById,
} = require('./position.helpers');
const {
  skip,
  limit,
  filter,
  newPositionInputData,
  wrongId,
} = require('./position.variables');
const {
  POSITION_NOT_FOUND,
} = require('../../error-messages/positions.massage');

let operations;
let positionDataForQuery;
let positionInput;

describe('Position query test', () => {
  beforeAll(async () => {
    operations = await setupApp();
    positionInput = newPositionInputData();
    positionDataForQuery = await createPosition(positionInput, operations);
  });

  test('should get all positions', async () => {
    const result = await getAllPositions({ limit, skip, filter }, operations);

    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });

  test('should get position by id', async () => {
    const result = await getPositionById(positionDataForQuery._id, operations);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('available', positionInput.available);
  });

  test('getPositionById should get POSITION_NOT_FOUND error msg', async () => {
    const result = await getPositionById(wrongId, operations);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('message', POSITION_NOT_FOUND);
  });

  afterAll(async () => {
    mongoose.connection.db.dropDatabase();
  });
});
