const { gql } = require('@apollo/client');
const { setupApp } = require('../helper-functions');

const { createMaterial } = require('../materials/material.helper');
const { createColor } = require('../color/color.helper');
const {
  createConstructorBasicWithData,
  getConstructorBasicById,
  deleteConstructorBasic,
} = require('./constructor-basic.helper');
const {
  BASIC_ALREADY_EXIST,
  BASIC_NOT_FOUND,
} = require('../../error-messages/constructor-basic-messages');

const {
  newColor,
  badConstructorBasicID,
  newMaterial,
  deleteAll,
  newConstructorBasic,
  getConstructorData,
  getConstructorDataBeforeUpt,
  getConstructorDataForUpt,
  getConstructorDataForUptCompare,
} = require('./constructor-basic.variables');

let operations;
let colorId;
let materialInput;
let materialID;
let constructorInput;
let constructorBasicID;
let currentConstructorBasic = {};
let construrtorIDafter;
let constructorUpdateInput;
jest.mock('../../modules/currency/currency.utils.js');

describe('constructor mutations', () => {
  beforeAll(async done => {
    operations = await setupApp();
    colorId = await createColor(newColor, operations);
    materialInput = newMaterial(colorId);
    materialID = await createMaterial(materialInput, operations);
    constructorInput = newConstructorBasic(materialID, colorId);

    constructorUpdateInput = getConstructorDataForUpt(constructorInput);
    currentConstructorBasic = getConstructorData(constructorInput);
    done();
  });
  test('#1 Should add Constructor Basic', async done => {
    const createConstructor = await createConstructorBasicWithData(
      constructorInput,
      operations
    );

    constructorBasicID = createConstructor._id;
    expect(createConstructor).toBeDefined();
    expect(createConstructor).toEqual({
      ...currentConstructorBasic,
      _id: constructorBasicID,
    });

    const getConstructorBasic = await getConstructorBasicById(
      constructorBasicID,
      operations
    );
    const receivedConstructorBasic =
      getConstructorBasic.data.getConstructorBasicById;
    expect(receivedConstructorBasic).toBeDefined();
    expect(createConstructor).toEqual(receivedConstructorBasic);
    done();
  });

  test('#2 Should update existing constructorBasic ', async done => {
    const beforeUpdateInput = getConstructorDataBeforeUpt(constructorInput);

    const constructorIdUpt = await createConstructorBasicWithData(
      beforeUpdateInput,
      operations
    );

    const updateConstructor = await operations.mutate({
      mutation: gql`
        mutation($id: ID!, $constructorElement: ConstructorBasicInput!) {
          updateConstructorBasic(
            id: $id
            constructorElement: $constructorElement
          ) {
            ... on ConstructorBasic {
              _id
              name {
                lang
                value
              }
              material {
                _id
              }
              color {
                _id
              }
              image
              available
              default
            }
            ... on Error {
              statusCode
              message
            }
          }
        }
      `,
      variables: {
        constructorElement: constructorUpdateInput,
        id: constructorIdUpt._id,
      },
    });
    const constructorAfterUpdate =
      updateConstructor.data.updateConstructorBasic;
    construrtorIDafter = constructorAfterUpdate._id;
    const constructorData = getConstructorDataForUptCompare(
      constructorAfterUpdate
    );
    expect(constructorAfterUpdate).toBeDefined();
    expect(constructorData).toEqual({
      ...constructorUpdateInput,
      _id: constructorAfterUpdate._id,
    });
    done();
  });

  test('#3 ConstructorBasic should return Error ConstructorBasic already exist', async done => {
    await createConstructorBasicWithData(constructorInput, operations);
    const createConstructor = await createConstructorBasicWithData(
      constructorInput,
      operations
    );

    const error = createConstructor;
    expect(error).toBeDefined();
    expect(error.message).toEqual(BASIC_ALREADY_EXIST);
    expect(error.statusCode).toEqual(400);
    done();
  });

  test('#4 UpdateConstructorBasic should return BASIC_NOT_FOUND', async done => {
    const updateConstructor = await operations.mutate({
      mutation: gql`
        mutation($id: ID!, $constructorElement: ConstructorBasicInput!) {
          updateConstructorBasic(
            id: $id
            constructorElement: $constructorElement
          ) {
            ... on ConstructorBasic {
              _id
            }
            ... on Error {
              statusCode
              message
            }
          }
        }
      `,
      variables: {
        id: badConstructorBasicID,
        constructorElement: constructorInput,
      },
    });
    const result = updateConstructor.data.updateConstructorBasic.message;
    expect(result).toBe(BASIC_NOT_FOUND);
    done();
  });
  test('#5 deleteConstructorBasic should return error BASIC_NOT_FOUND', async done => {
    const deletedConstructor = await deleteConstructorBasic(
      badConstructorBasicID,
      operations
    );
    const result = deletedConstructor.data.deleteConstructorBasic.message;
    expect(result).toBe(BASIC_NOT_FOUND);
    done();
  });
  test('#6 Should delete constructor basic and return id', async done => {
    const deletedConstructor = await operations.mutate({
      mutation: gql`
        mutation($id: ID!) {
          deleteConstructorBasic(id: $id) {
            ... on ConstructorBasic {
              _id
            }
          }
        }
      `,
      variables: { id: constructorBasicID },
    });
    const result = deletedConstructor.data.deleteConstructorBasic._id;
    expect(result).toBe(constructorBasicID);
    done();
  });

  afterAll(async done => {
    await deleteAll(
      colorId,
      materialID,
      constructorBasicID,
      construrtorIDafter
    );
    done();
  });
});
