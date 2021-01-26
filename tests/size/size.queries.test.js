const { gql } = require('@apollo/client');
const { setupApp } = require('../helper-functions');
const { SIZES_TO_CREATE, SIZES_TO_TEST } = require('./size.variables');
const {
  createSize,
  getAllSizes,
  getSizeById,
  deleteSize,
} = require('./size.helper');

let operations;
let sizeId1;
let sizeId2;

describe('Sizes queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
    sizeId1 = await createSize(SIZES_TO_CREATE.size1, operations);
    sizeId2 = await createSize(SIZES_TO_CREATE.size2, operations);
  });

  test('should recieve all sizes', async () => {
    const result = await getAllSizes(operations);
    expect(result).toContainEqual(SIZES_TO_TEST.size1);
    expect(result).toContainEqual(SIZES_TO_TEST.size2);
  });

  test('should recieve sizes by ID', async () => {
    const result = await getSizeById(sizeId1, operations);
    expect(result).toEqual({
      _id: sizeId1,
      ...SIZES_TO_TEST.size1,
    });
  });

  afterAll(async () => {
    await deleteSize(sizeId1, operations);
    await deleteSize(sizeId2, operations);
  });
});
