const {
  patternToUpdate,
  wrongId,
  mutationPatternToAdd,
} = require('./pattern.variables');
const {
  PATTERN_ALREADY_EXIST,
  PATTERN_NOT_FOUND,
} = require('../../error-messages/pattern.messages');
const { setupApp } = require('../helper-functions');
const {
  createPattern,
  deletePattern,
  updatePattern,
} = require('./pattern.helper');

jest.mock('../../modules/upload/upload.service');

let patternId;
let operations;

describe('pattern mutation tests', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });

  it('should add pattern to database', async () => {
    const addedPattern = await createPattern(mutationPatternToAdd, operations);
    patternId = addedPattern._id;

    expect(addedPattern).toHaveProperty(
      'name',
      mutationPatternToAdd.name.map(item => ({
        ...item,
      }))
    );
    expect(addedPattern).toHaveProperty(
      'description',
      mutationPatternToAdd.description.map(item => ({
        ...item,
      }))
    );
    expect(addedPattern).toHaveProperty('images');
    expect(addedPattern).toHaveProperty(
      'handmade',
      mutationPatternToAdd.handmade
    );
    expect(addedPattern).toHaveProperty(
      'available',
      mutationPatternToAdd.available
    );
    expect(addedPattern).toHaveProperty(
      'material',
      mutationPatternToAdd.material
    );
  });
  it('should return error if we try to create pattern with name that already exists', async () => {
    const res = await createPattern(mutationPatternToAdd, operations);

    expect(res).toHaveProperty('message', PATTERN_ALREADY_EXIST);
    expect(res).toHaveProperty('statusCode', 400);
  });
  it('should update pattern', async () => {
    const updatedPattern = await updatePattern(
      patternId,
      patternToUpdate,
      operations
    );

    expect(updatedPattern.name).toBeInstanceOf(Array);
    expect(updatedPattern).toHaveProperty('name', patternToUpdate.name);
    expect(updatedPattern).toHaveProperty(
      'description',
      patternToUpdate.description
    );
    expect(updatedPattern.description).toBeInstanceOf(Array);
    expect(updatedPattern).toHaveProperty('images');

    expect(updatedPattern).toHaveProperty('handmade', patternToUpdate.handmade);
    expect(updatedPattern).toHaveProperty(
      'available',
      patternToUpdate.available
    );
  });
  it('should return error if we try to update pattern with wrong id', async () => {
    const res = await updatePattern(wrongId, patternToUpdate, operations);

    expect(res).toHaveProperty('statusCode', 404);
    expect(res).toHaveProperty('message', PATTERN_NOT_FOUND);
  });
  it('should delete pattern from database', async () => {
    const deletedData = await deletePattern(patternId, operations);

    expect(deletedData.data.deletePattern._id).toEqual(patternId);
  });
  it('should return error if we try to delete not existing pattern', async () => {
    const res = await deletePattern(wrongId, operations);

    expect(res.data.deletePattern).toHaveProperty('statusCode', 404);
    expect(res.data.deletePattern).toHaveProperty('message', PATTERN_NOT_FOUND);
  });
});
