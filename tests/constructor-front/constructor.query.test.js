const { gql } = require('@apollo/client');
const { setupApp } = require('../helper-functions');
const {
  FRONT_POCKET_NOT_FOUND,
} = require('../../error-messages/constructor-front-pocket-messages');

const {
  createConstructorFrontPocketWithData,
  getAllConstructorFrontPocket,
  getConstructorFrontPocketById,
} = require('./constructor.front.helper');

const {
  badConstructorFrontID,
  newColor,
  newMaterial,
  getConstructorData,
  newConstructorFront,
  deleteAll,
} = require('./constructor.variables');

const { createColor } = require('../color/color.helper');
const { createMaterial } = require('../materials/material.helper');

let operations;
let colorId;
let materialInput;
let materialID;
let constructorInput;
let constructorFrontID;
let constructorFrontPocket;

jest.mock('../../modules/currency/currency.utils.js');

describe('constructor mutations', () => {
  beforeAll(async done => {
    operations = await setupApp();
    colorId = await createColor(newColor, operations);
    materialInput = newMaterial(colorId);
    materialID = await createMaterial(materialInput, operations);
    constructorInput = newConstructorFront(materialID, colorId);

    constructorFrontPocket = await createConstructorFrontPocketWithData(
      constructorInput,
      operations
    );
    constructorFrontID = constructorFrontPocket._id;

    currentConstructorFrontPocket = getConstructorData(constructorInput);
    done();
  });

  test('#1 Should return all Constructor Front Pocket', async done => {
    const allConstructorFrontPocket = await getAllConstructorFrontPocket(
      operations
    );
    const receivedAllConstructorFrontPocket = allConstructorFrontPocket;
    expect(receivedAllConstructorFrontPocket.items).toBeDefined();
    expect(receivedAllConstructorFrontPocket.items.length).toBeGreaterThan(0);
    done();
  });

  test('#2 Should return  Constructor Front Pocket by Id', async done => {
    const constructorFrontPocketById = await getConstructorFrontPocketById(
      constructorFrontID,
      operations
    );
    const receivedById =
      constructorFrontPocketById.data.getConstructorFrontPocketById;
    expect(receivedById).toBeDefined();
    expect(receivedById).toEqual({
      ...currentConstructorFrontPocket,
      _id: constructorFrontID,
    });

    done();
  });

  test('#3 Should return  Error', async done => {
    const constructorFrontPocketById = await getConstructorFrontPocketById(
      badConstructorFrontID,
      operations
    );
    const receivedError =
      constructorFrontPocketById.data.getConstructorFrontPocketById;
    expect(receivedError.statusCode).toBe(404);
    expect(receivedError.message).toBe(FRONT_POCKET_NOT_FOUND);
    done();
  });
  afterAll(async done => {
    await deleteAll(colorId, materialID, constructorFrontID);
    done();
  });
});
