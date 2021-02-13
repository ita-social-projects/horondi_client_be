const { setupApp } = require('../helper-functions');
const { createColor, deleteColor } = require('../color/color.helper');
const {
  createMaterial,
  deleteMaterial,
} = require('../materials/material.helper');
const {
  createConstructorBasic,
  getAllConstructorBasics,
  getConstructorBasicById,
  deleteConstructorBasic,
} = require('./constructor-basic.helper');
const {
  wrongId,
  newConstructorBasic,
  getConstructorData,
} = require('./constructor-basic.variables');
const { color } = require('../color/color.variables');
const { getMaterial } = require('../materials/material.variables');
const {
  BASIC_NOT_FOUND,
} = require('../../error-messages/constructor-basic-messages');

let operations;
let colorId;
let materialInput;
let receivedMaterial;
let materialId;
let constructorInput;
let constructorBasic;
let constructorBasicId;
let currentConstructorBasic;

jest.mock('../../modules/currency/currency.utils.js');
jest.mock('../../modules/upload/upload.service');

describe('constructor mutations', () => {
  beforeAll(async done => {
    operations = await setupApp();
    const colorData = await createColor(color, operations);
    colorId = colorData._id;
    materialInput = getMaterial(colorId);
    receivedMaterial = await createMaterial(materialInput, operations);
    materialId = receivedMaterial._id;
    constructorInput = newConstructorBasic(materialId, colorId);

    constructorBasic = await createConstructorBasic(
      constructorInput,
      operations
    );
    constructorBasicId = constructorBasic._id;

    currentConstructorBasic = getConstructorData(constructorInput);
    done();
  });

  test('#1 Should return all ConstructorBasics', async done => {
    const receivedAllConstructorBasics = await getAllConstructorBasics(
      operations
    );

    expect(receivedAllConstructorBasics.items).toBeDefined();
    expect(receivedAllConstructorBasics.items.length).toBeGreaterThan(0);
    done();
  });
  test('#2 Should return  ConstructorBasics by Id', async done => {
    const receivedById = await getConstructorBasicById(
      constructorBasicId,
      operations
    );

    expect(receivedById).toBeDefined();
    expect(receivedById).toEqual({
      ...currentConstructorBasic,
      _id: constructorBasicId,
    });
    done();
  });
  test('#3 Should return  Error', async done => {
    const receivedError = await getConstructorBasicById(wrongId, operations);

    expect(receivedError.statusCode).toBe(404);
    expect(receivedError.message).toBe(BASIC_NOT_FOUND);
    done();
  });

  afterAll(async done => {
    await deleteConstructorBasic(constructorBasicId, operations);
    await deleteMaterial(materialId, operations);
    await deleteColor(colorId, operations);
    done();
  });
});
