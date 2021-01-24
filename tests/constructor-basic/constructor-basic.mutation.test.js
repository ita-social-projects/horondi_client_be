const { gql } = require('@apollo/client');
const { setupApp } = require('../helper-functions');
const {
  BASIC_ALREADY_EXIST,
  BASIC_NOT_FOUND,
} = require('../../error-messages/constructor-basic-messages');

const {
  newColor,
  badConstructorBasicID,
  newMaterial,
  createMaterial,
  deleteAll,
  newConstructorBasic,
  getConstructorData,
  createConstructorBasic,
  getConstructorDataBeforeUpt,
  getConstructorDataForUpt,
  getConstructorDataForUptCompare,
} = require('./constructor-basic.variables');
const { createColor } = require('../materials/material.variables');

let operations;
let colorIdMy;
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
    colorIdMy = await createColor(newColor);
    materialInput = newMaterial(colorIdMy);
    materialID = await createMaterial(materialInput);
    constructorInput = newConstructorBasic(materialID, colorIdMy);

    constructorUpdateInput = getConstructorDataForUpt(constructorInput);
    currentConstructorBasic = getConstructorData(constructorInput);
    done();
  });
  test('#1 Should add Constructor Basic', async done => {
    const createConstructor = await operations.mutate({
      mutation: gql`
        mutation($constructorElement: ConstructorBasicInput!) {
          addConstructorBasic(constructorElement: $constructorElement) {
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
      variables: { constructorElement: constructorInput },
    });

    constructorBasicID = createConstructor.data.addConstructorBasic._id;
    expect(createConstructor.data.addConstructorBasic).toBeDefined();
    expect(createConstructor.data.addConstructorBasic).toEqual({
      ...currentConstructorBasic,
      _id: constructorBasicID,
    });
    const getConstructorBasic = await operations.query({
      query: gql`
        query($id: ID!) {
          getConstructorBasicById(id: $id) {
            ... on ConstructorBasic {
              _id
              name {
                lang
                value
              }
              material {
                _id
                name {
                  lang
                  value
                }
              }
              available
            }
            ... on Error {
              statusCode
              message
            }
          }
        }
      `,
      variables: { id: constructorBasicID },
    });

    const receivedConstructorBasic =
      getConstructorBasic.data.getConstructorBasicById;
    expect(receivedConstructorBasic).toBeDefined();
    expect(createConstructor.data.addConstructorBasic).toEqual({
      ...currentConstructorBasic,
      _id: constructorBasicID,
    });
    done();
  });

  test('#2 Should update existing constructorBasic ', async done => {
    const beforeUpdateInput = getConstructorDataBeforeUpt(constructorInput);

    const constructorIdUpt = await createConstructorBasic(beforeUpdateInput);

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
    const createConstructorF = await operations.mutate({
      mutation: gql`
        mutation($constructorElement: ConstructorBasicInput!) {
          addConstructorBasic(constructorElement: $constructorElement) {
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
      variables: { constructorElement: constructorInput },
    });
    const createConstructor = await operations.mutate({
      mutation: gql`
        mutation($constructorElement: ConstructorBasicInput!) {
          addConstructorBasic(constructorElement: $constructorElement) {
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
      variables: { constructorElement: constructorInput },
    });

    const error = createConstructor.data.addConstructorBasic.message;
    expect(error).toBeDefined();
    expect(error).toEqual(BASIC_ALREADY_EXIST);
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
    const deletedConstructor = await operations.mutate({
      mutation: gql`
        mutation($id: ID!) {
          deleteConstructorBasic(id: $id) {
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
      variables: { id: badConstructorBasicID },
    });
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
      colorIdMy,
      materialID,
      constructorBasicID,
      construrtorIDafter
    );
    done();
  });
});
