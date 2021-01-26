const { createMaterial } = require('../materials/material.helper');
const { createColor } = require('../color/color.helper');
const { setupApp } = require('../helper-functions');

const {
  color,
  newMaterial,
  newConstructorBottom,
  deleteAll,
  wrongID,
  createConstructorBottomQuery,
} = require('./constructor-bottom.variables');

const {
  getAllConstructorBottom,
  getConstructorBottom,
  constructorBottomByIdEr,
} = require('./constructor-bottom.helper');

let operations;
let colorId;
let materialInput;
let materialId;
let addConstructor;
let newConstructorForQuery;

describe('Constructor query', () => {
  beforeAll(async () => {
    operations = await setupApp();
    colorId = await createColor(color, operations);
    materialInput = newMaterial(colorId);
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
    const constructorBottomById = await constructorBottomByIdEr(
      wrongID,
      operations
    );
    expect(constructorBottomById.statusCode).toBe(404);
  });
});
