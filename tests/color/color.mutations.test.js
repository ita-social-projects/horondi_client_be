const { setupApp } = require('../helper-functions');
const { wrongId, color } = require('./color.variables');
const {
  COLOR_ALREADY_EXIST,
  COLOR_NOT_FOUND,
} = require('../../error-messages/color.massage');
const {
  STATUS_CODES: { BAD_REQUEST, NOT_FOUND },
} = require('../../consts/status-codes');
const { createColor, deleteColor } = require('./color.helper');

let operations;
let colorId;

describe('Color mutations', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });

  test('Should add color', async () => {
    const result = await createColor(color, operations);
    colorId = result._id;

    expect(result).toEqual({
      _id: colorId,
      ...color,
    });
  });
  test('Should recive error message COLOR_ALREADY_EXIST when color already in the db while creating', async () => {
    const result = await createColor(color, operations);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('message', COLOR_ALREADY_EXIST);
    expect(result).toHaveProperty('statusCode', BAD_REQUEST);
  });
  test('Should delete color by ID', async () => {
    const result = await deleteColor(colorId, operations);

    expect(result.data.deleteColor).toEqual({
      _id: colorId,
      ...color,
    });
  });
  test('Should recieve error message COLOR_NOT_FOUND on deleting color with wrong ID', async () => {
    const result = await deleteColor(wrongId, operations);

    expect(result).toBeDefined();
    expect(result.data.deleteColor).toHaveProperty('message', COLOR_NOT_FOUND);
    expect(result.data.deleteColor).toHaveProperty('statusCode', NOT_FOUND);
  });
});
