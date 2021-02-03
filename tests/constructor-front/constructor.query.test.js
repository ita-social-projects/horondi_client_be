const { setupApp } = require('../helper-functions');
const {
  FRONT_POCKET_NOT_FOUND,
} = require('../../error-messages/constructor-front-pocket-messages');
const {
  createConstructorFrontPocket,
  getAllConstructorFrontPocket,
  getConstructorFrontPocketById,
  deleteConstructorFrontPocket,
} = require('./constructor.front.helper');
const {
  getConstructorData,
  newConstructorFront,
  wrongId,
} = require('./constructor.variables');
const { createColor, deleteColor } = require('../color/color.helper');
const {
  createMaterial,
  deleteMaterial,
} = require('../materials/material.helper');
const { color } = require('../color/color.variables');
const { getMaterial } = require('../materials/material.variables');

let operations;
let colorId;
let materialID;
let constructorInput;
let constructorFrontID;
let constructorFrontPocket;
let currentConstructorFrontPocket;

jest.mock('../../modules/currency/currency.utils.js');

describe('constructor mutations', () => {
  beforeAll(async () => {
    operations = await setupApp();
    const colorData = await createColor(color, operations);
    colorId = colorData._id;
    const materialData = await createMaterial(getMaterial(colorId), operations);
    materialID = materialData._id;
    constructorInput = newConstructorFront(materialID, colorId);
    constructorFrontPocket = await createConstructorFrontPocket(
      constructorInput,
      operations
    );
    constructorFrontID = constructorFrontPocket._id;

    currentConstructorFrontPocket = getConstructorData(constructorInput);
  });

  test('#1 Should return all Constructor Front Pocket', async () => {
    const receivedAllConstructorFrontPocket = await getAllConstructorFrontPocket(
      operations
    );
    expect(receivedAllConstructorFrontPocket.items).toBeDefined();
    expect(receivedAllConstructorFrontPocket.items.length).toBeGreaterThan(0);
  });
  test('#2 Should return  Constructor Front Pocket by Id', async () => {
    const receivedById = await getConstructorFrontPocketById(
      constructorFrontID,
      operations
    );

    expect(receivedById).toBeDefined();
    expect(receivedById).toEqual({
      ...currentConstructorFrontPocket,
      _id: constructorFrontID,
    });
  });

  test('#3 Should return  Error', async () => {
    const receivedError = await getConstructorFrontPocketById(
      wrongId,
      operations
    );

    expect(receivedError.statusCode).toBe(404);
    expect(receivedError.message).toBe(FRONT_POCKET_NOT_FOUND);
  });
  afterAll(async () => {
    await deleteConstructorFrontPocket(constructorFrontID, operations);
    await deleteMaterial(materialID, operations);
    await deleteColor(colorId, operations);
  });
});
