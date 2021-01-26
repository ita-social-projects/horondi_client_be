const { gql } = require('@apollo/client');
const { setupApp } = require('../helper-functions');
const { createColor } = require('../color/color.helper');
const { createMaterial } = require('../materials/material.helper');
const {
  createConstructorBasicWithData,
  getAllConstructorBasics,
  getConstructorBasicById,
} = require('./constructor-basic.helper');
const {
  newColor,
  badConstructorBasicID,
  newMaterial,
  deleteAll,
  newConstructorBasic,
  getConstructorData,
} = require('./constructor-basic.variables');
const {
  BASIC_NOT_FOUND,
} = require('../../error-messages/constructor-basic-messages');

let operations;
let colorId;
let materialInput;
let materialID;
let constructorInput;
let constructorBasic;
let constructorBasicId;
jest.mock('../../modules/currency/currency.utils.js');

describe('constructor mutations', () => {
  beforeAll(async done => {
    operations = await setupApp();
    colorId = await createColor(newColor, operations);
    materialInput = newMaterial(colorId);
    materialID = await createMaterial(materialInput, operations);
    constructorInput = newConstructorBasic(materialID, colorId);

    constructorBasic = await createConstructorBasicWithData(
      constructorInput,
      operations
    );
    constructorBasicId = constructorBasic._id;

    currentConstructorBasic = getConstructorData(constructorInput);
    done();
  });

  test('#1 Should return all ConstructorBasics', async done => {
    const allConstructorBasics = await getAllConstructorBasics(operations);
    const receivedAllConstructorBasics = allConstructorBasics;
    expect(receivedAllConstructorBasics.items).toBeDefined();
    expect(receivedAllConstructorBasics.items.length).toBeGreaterThan(0);
    done();
  });

  test('#2 Should return  ConstructorBasics by Id', async done => {
    const constructorBasicsById = await getConstructorBasicById(
      constructorBasicId,
      operations
    );
    const receivedById = constructorBasicsById.data.getConstructorBasicById;
    expect(receivedById).toBeDefined();
    expect(receivedById).toEqual({
      ...currentConstructorBasic,
      _id: constructorBasicId,
    });

    done();
  });

  test('#3 Should return  Error', async done => {
    const constructorBasicsById = await getConstructorBasicById(
      badConstructorBasicID,
      operations
    );
    const receivedError = constructorBasicsById.data.getConstructorBasicById;
    expect(receivedError.statusCode).toBe(404);
    expect(receivedError.message).toBe(BASIC_NOT_FOUND);
    done();
  });
  afterAll(async done => {
    await deleteAll(colorId, materialID, constructorBasicId);
    done();
  });
});
