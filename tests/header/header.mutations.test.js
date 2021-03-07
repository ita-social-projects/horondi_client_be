const { setupApp } = require('../helper-functions');
const { addHeader, deleteHeader, updateHeader } = require('./header.helper');
const {
  firstHeader,
  secondHeader,
  wrongId,
  ERROR_ALREADY_EXISTS,
  ERROR_NOT_FOUND,
} = require('./header.variables');

describe('Header mutations tests', () => {
  let operations;
  let headerId;
  beforeAll(async () => {
    operations = await setupApp();
  });

  test('Should add header', async () => {
    const result = await addHeader(firstHeader, operations);
    headerId = result._id;
    expect(result).toEqual({ _id: headerId, ...firstHeader });
  });

  test('Should get HEADER_ALREADY_EXISTS error when trying to create header that is in db', async () => {
    const result = await addHeader(firstHeader, operations);
    expect(result).toEqual(ERROR_ALREADY_EXISTS);
  });

  test('Should get HEADER_NOT_FOUND error when trying to update non-existent header', async () => {
    const result = await updateHeader(wrongId, firstHeader, operations);
    expect(result).toEqual(ERROR_NOT_FOUND);
  });

  test('Should update header', async () => {
    const updatedHeader = await updateHeader(
      headerId,
      secondHeader,
      operations
    );
    expect(updatedHeader).toEqual({ _id: headerId, ...secondHeader });
  });

  test('Should get HEADER_ALREADY_EXISTS if updated header already exists', async () => {
    const headerToUpdate = await addHeader(firstHeader, operations);
    const result = await updateHeader(
      headerToUpdate._id,
      secondHeader,
      operations
    );
    expect(result).toEqual(ERROR_ALREADY_EXISTS);
    await deleteHeader(headerToUpdate._id, operations);
  });

  test('Should delete header', async () => {
    const result = await deleteHeader(headerId, operations);
    expect(result).toEqual({ _id: headerId, ...secondHeader });
  });

  test('Should get HEADER_NOT_FOUND error when trying to delete non-existent header', async () => {
    const result = await deleteHeader(wrongId, operations);
    expect(result).toEqual(ERROR_NOT_FOUND);
  });
});
