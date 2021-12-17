const mongoose = require('mongoose');

const { setupApp } = require('../helper-functions');
const {
  createPosition,
  updatePosition,
  deletePosition,
} = require('./position.helpers');
const {
  newPositionInputData,
  positionUpdateData,
  wrongId,
} = require('./position.variables');
const {
  POSITION_NOT_FOUND,
  POSITION_ALREADY_EXIST,
} = require('../../error-messages/positions.massage');

let operations;
let positionId;
let positionUpdateInput;
let positionInput;

describe('Back mutation tests', () => {
  beforeAll(async () => {
    operations = await setupApp();

    positionInput = newPositionInputData();
    positionUpdateInput = positionUpdateData();
  });

  test('should create position', async () => {
    const createPositionTest = await createPosition(positionInput, operations);
    positionId = createPositionTest._id;

    expect(createPositionTest).toBeDefined();
    expect(createPositionTest).toHaveProperty(
      'available',
      positionInput.available,
    );
    expect(createPositionTest).toHaveProperty('name', positionInput.name);
  });

  test('should get POSITION_ALREADY_EXIST err msg for create', async () => {
    const result = await createPosition(positionInput, operations);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('message', POSITION_ALREADY_EXIST);
  });

  test('should update position', async () => {
    const updatePositionTest = await updatePosition(
      positionId,
      positionUpdateInput,
      operations,
    );

    expect(updatePositionTest).toBeDefined();
    expect(updatePositionTest).toHaveProperty('id', positionUpdateInput.id);
  });

  test('delete position should return error POSITION_NOT_FOUND', async () => {
    const result = await deletePosition(wrongId, operations);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('message', POSITION_NOT_FOUND);
  });

  test('update position should return error POSITION_NOT_FOUND', async () => {
    const result = await updatePosition(
      wrongId,
      positionUpdateInput,
      operations,
    );

    expect(result).toBeDefined();
    expect(result).toHaveProperty('message', POSITION_NOT_FOUND);
  });

  test('should delete position', async () => {
    const deletedPosition = await deletePosition(positionId, operations);

    const result = deletedPosition._id;
    expect(result).toBe(positionId);
  });

  afterAll(async () => {
    mongoose.connection.db.dropDatabase();
  });
});
