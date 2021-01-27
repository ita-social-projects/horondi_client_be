const { gql } = require('@apollo/client');
const { setupApp } = require('../helper-functions');
const {
  SIZES_TO_CREATE,
  SIZES_TO_TEST,
  WRONG_ID,
  ERROR_ALREDY_EXISTS,
  ERROR_NOT_FOUND,
} = require('./size.variables');
const {
  addSize,
  getSizeById,
  errorAdd,
  updateSize,
  errorUpdate,
  deleteSizeMutation,
  erorrDelete,
} = require('./size.helper');

jest.mock('../../modules/currency/currency.utils.js');

let operations;
let sizeId;
let size_updated;

describe('Sizes mutations', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });

  test('should add size', async () => {
    const result = await addSize(SIZES_TO_CREATE.size1, operations);
    sizeId = result._id;
    expect(result).toEqual({
      _id: sizeId,
      ...SIZES_TO_TEST.size1,
    });
  });

  test('should recieve error SIZE_ALREADY_EXIST while adding size', async () => {
    const result = await errorAdd(SIZES_TO_CREATE.size1, operations);
    expect(result).toEqual({
      ...ERROR_ALREDY_EXISTS,
    });
  });

  test('should update size by ID and input', async () => {
    const result = await updateSize(sizeId, SIZES_TO_CREATE.size2, operations);
    const resultGetSizeById = await getSizeById(sizeId, operations);
    size_updated = resultGetSizeById;
    expect(resultGetSizeById).toEqual({
      _id: sizeId,
      ...SIZES_TO_TEST.size2,
    });
  });

  test('should receive error message SIZE_NOT_FOUND while updating', async () => {
    const result = await errorUpdate(
      WRONG_ID,
      SIZES_TO_CREATE.size1,
      operations
    );
    expect(result).toEqual({
      ...ERROR_NOT_FOUND,
    });
  });

  test('Should delete size by ID', async () => {
    const result = await deleteSizeMutation(sizeId, operations);
    expect(result).toEqual({
      ...size_updated,
    });
  });

  test('should recieve error SIZE_NOT_FOUND while deleting', async () => {
    const result = await erorrDelete(
      WRONG_ID,
      SIZES_TO_CREATE.size1,
      operations
    );
    expect(result).toEqual(ERROR_NOT_FOUND);
  });
});
