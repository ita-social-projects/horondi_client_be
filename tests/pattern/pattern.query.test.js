const { PATTERN_NOT_FOUND } = require('../../error-messages/pattern.messages');
const { setupApp } = require('../helper-functions');
const {
  createPattern,
  deletePattern,
  getAllPatterns,
  getPatternById,
  getAllPatternsPaginated,
} = require('./pattern.helper');
const {
  wrongId,
  skip,
  limit,
  wrongLimit,
  wrongSkip,
  queryPatternToAdd,
} = require('./pattern.variables');

let patternId;
let operations;

jest.mock('../../modules/upload/upload.service');

describe('Pattern queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
    const res = await createPattern(queryPatternToAdd, operations);
    patternId = res._id;
  });

  test('Should receive all patterns', async () => {
    const res = await getAllPatterns(operations);

    expect(res).toEqual({
      items: [queryPatternToAdd],
    });
  });
  test('Should receive one pattern', async () => {
    const res = await getPatternById(patternId, operations);

    expect(res).toEqual(queryPatternToAdd);
  });
  test('request not existing pattern should throw error', async () => {
    const res = await getPatternById(wrongId, operations);

    expect(res).toBeDefined();
    expect(res).toHaveProperty('statusCode', 404);
    expect(res).toHaveProperty('message', PATTERN_NOT_FOUND);
  });
  test('pattern pagination test', async () => {
    const res = await getAllPatternsPaginated(skip, limit, operations);

    expect(res.data.getAllPatterns.items).toHaveLength(1);
    expect(res.data.getAllPatterns.count).toEqual(1);
  });
  test('Expect negative values', async () => {
    const res = await getAllPatternsPaginated(
      wrongSkip,
      wrongLimit,
      operations
    );

    expect(res.errors[0].message).toEqual(
      'Skip value must be non-negative, but received: -1'
    );
  });

  afterAll(async () => {
    await deletePattern(patternId, operations);
  });
});
