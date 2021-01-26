const { gql } = require('@apollo/client');
const { setupApp } = require('../helper-functions');
const {
  WRONG_ID,
  COLOR,
  ERROR_NOT_FOUND,
  ERROR_ALREDY_EXISTS,
} = require('./color.variables');
const {
  addColor,
  errorAdd,
  deleteColorMutation,
  errorDelete,
} = require('./color.helper');

let operations;
let colorId;

describe('Color mutations', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });

  test('Should add color', async () => {
    const result = await addColor(COLOR, operations);
    colorId = result._id;
    expect(result).toEqual({
      _id: colorId,
      ...COLOR,
    });
  });

  test('Should recive error message COLOR_ALREADY_EXIST when color already in the db while creating', async () => {
    const result = await errorAdd(COLOR, operations);
    expect(result).toEqual(ERROR_ALREDY_EXISTS);
  });

  test('Should delete color by ID', async () => {
    const result = await deleteColorMutation(colorId, operations);
    expect(result).toEqual({
      _id: colorId,
      ...COLOR,
    });
  });

  test('Should recieve error message COLOR_NOT_FOUND on deleting color with wrong ID', async () => {
    const result = await errorDelete(WRONG_ID, operations);
    expect(result).toEqual(ERROR_NOT_FOUND);
  });
});
