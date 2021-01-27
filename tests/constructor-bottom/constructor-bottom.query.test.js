const { createMaterial } = require('../materials/material.helper');
const { createColor } = require('../color/color.helper');
const { setupApp } = require('../helper-functions');
const { createConstructorBottomQuery } = require('./constructor-bottom.helper');
const { getMaterial } = require('../materials/material.variables');
const { COLOR, WRONG_ID } = require('../color/color.variables');

const {
  newConstructorBottom,
  deleteAll,
} = require('./constructor-bottom.variables');

const {
  getAllConstructorBottom,
  getConstructorBottom,
} = require('./constructor-bottom.helper');

let operations;
let colorId;
let materialInput;
let materialId;
let addConstructor;
let newConstructorForQuery;

jest.mock('../../modules/currency/currency.utils.js');

describe('Constructor query', () => {
  beforeAll(async () => {
    operations = await setupApp();
    colorId = await createColor(COLOR, operations);
    materialInput = getMaterial(colorId);
    materialId = await createMaterial(materialInput, operations);
    addConstructor = newConstructorBottom(colorId, materialId);
    newConstructorForQuery = await createConstructorBottomQuery(addConstructor);
  });
  afterAll(async () => {
    await deleteAll(colorId, materialId, newConstructorForQuery);
  });
  test('should return all ConstructorBasics', async () => {
    const allConstructorBottom = await getAllConstructorBottom(operations);
    expect(allConstructorBottom).toBeDefined();
    expect(allConstructorBottom.length).toBeGreaterThan(0);
  });
  test('should return constructor-bottom by Id', async () => {
    const constructorBottomById = await getConstructorBottom(
      newConstructorForQuery,
      operations
    );
    expect(constructorBottomById).toBeDefined();
  });
  test('should return error when try to get constructor-bottom by wrong ID', async () => {
    const constructorBottomById = await getConstructorBottom(
      WRONG_ID,
      operations
    );
    expect(constructorBottomById.statusCode).toBe(404);
  });
});
