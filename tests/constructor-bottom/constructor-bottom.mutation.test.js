const { gql } = require('@apollo/client');
const { createMaterial } = require('../materials/material.helper');
const { createColor } = require('../color/color.helper');
const { getMaterial } = require('../materials/material.variables');
const { COLOR, WRONG_ID } = require('../color/color.variables');
const { setupApp } = require('../helper-functions');
const {
  CONSTRUCTOR_BOTTOM_NOT_FOUND,
  CONSTRUCTOR_BOTTOM_ALREADY_EXIST,
} = require('../../error-messages/constructor-bottom.messages');
const {
  createConstructorBottom,
  updateConstructorBottom,
  createConstructorBottomAgain,
  updateConstructorB,
  deleteConstructorBottom,
  updateConstructorBottomEr,
} = require('./constructor-bottom.helper');

const {
  newConstructorBottom,
  getConstructorData,
  deleteAll,
  getConstructorDataForUpt,
} = require('./constructor-bottom.variables');

let operations;
let colorId;
let materialInput;
let materialId;
let addConstructor;
let constructorId;
let currentConstructorBottom;
let newDataConstructorBottom;
let result;

describe('Constructor mutations', () => {
  beforeAll(async () => {
    operations = await setupApp();
    colorId = await createColor(COLOR, operations);
    materialInput = getMaterial(colorId);
    materialId = await createMaterial(materialInput, operations);
    addConstructor = newConstructorBottom(colorId, materialId);
    currentConstructorBottom = getConstructorData(addConstructor);
    newDataConstructorBottom = getConstructorDataForUpt(colorId, materialId);
  });
  afterAll(async () => {
    await deleteAll(colorId, materialId, constructorId);
  });
  test('should create constructor-bottom', async () => {
    const createConstructorB = await createConstructorBottom(
      addConstructor,
      operations
    );
    constructorId = createConstructorB._id;
    result = createConstructorB;
    expect(result).toBeDefined();
    expect(result).toEqual({
      ...currentConstructorBottom,
      _id: constructorId,
    });
  });
  test('should update existing constructor-bottom', async () => {
    await updateConstructorBottom(
      constructorId,
      operations,
      newDataConstructorBottom
    );
    expect(updateConstructorBottom).toBeDefined();
    expect(updateConstructorBottom.image).not.toEqual(result.image);
    expect(updateConstructorBottom.name).not.toEqual(result.name);
  });
  test('should return Error (already exist) when creating same constructor-bottom again', async () => {
    const createConstructorAgain = await createConstructorBottomAgain(
      newDataConstructorBottom,
      operations
    );
    expect(createConstructorAgain).toBeDefined();
    expect(createConstructorAgain).toEqual(CONSTRUCTOR_BOTTOM_ALREADY_EXIST);
  });
  test('should return Error (not found) when updating not existing constructor-bottom', async () => {
    const updateConstructor = await updateConstructorBottomEr(
      WRONG_ID,
      operations,
      addConstructor
    );
    expect(updateConstructor).toBe(CONSTRUCTOR_BOTTOM_NOT_FOUND);
  });
  test('should return Error (not found) when try to delete wrong constructor-bottom', async () => {
    const deletedConstructor = await updateConstructorB(
      WRONG_ID,
      operations,
      addConstructor
    );
    expect(deletedConstructor).toBe(CONSTRUCTOR_BOTTOM_NOT_FOUND);
  });
  test('should delete constructor-bottom and return id', async () => {
    const deletedConstructor = await deleteConstructorBottom(
      constructorId,
      operations
    );
    expect(deletedConstructor).toBe(constructorId);
  });
});
