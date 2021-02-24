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

describe('Pattern Mutation Tests', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });

  test('#1 Should Add Pattern To Database', async () => {
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

  test('#2 Should Return Error If We Try To Create Pattern With Name That Already Exists', async () => {
    const res = await createPattern(mutationPatternToAdd, operations);

    expect(res).toHaveProperty('message', PATTERN_ALREADY_EXIST);
    expect(res).toHaveProperty('statusCode', 400);
  });

  test('#3 Should Update Pattern', async () => {
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
    expect(updatedPattern).toHaveProperty('handmade', patternToUpdate.handmade);
    expect(updatedPattern).toHaveProperty(
      'available',
      patternToUpdate.available
    );
  });

  test('#4 Should Return Error If We Try To Update Pattern With Wrong Id', async () => {
    const res = await updatePattern(wrongId, patternToUpdate, operations);

    expect(res).toHaveProperty('statusCode', 404);
    expect(res).toHaveProperty('message', PATTERN_NOT_FOUND);
  });

  test('#5 Should Delete Pattern From Database', async () => {
    const deletedData = await deletePattern(patternId, operations);

    expect(deletedData.data.deletePattern._id).toEqual(patternId);
  });

  test('#6 Should Return Error If We Try To Delete Not Existing Pattern', async () => {
    const res = await deletePattern(wrongId, operations);

    expect(res.data.deletePattern).toHaveProperty('statusCode', 404);
    expect(res.data.deletePattern).toHaveProperty('message', PATTERN_NOT_FOUND);
  });
});
