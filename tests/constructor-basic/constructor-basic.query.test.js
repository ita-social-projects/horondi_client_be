const { gql } = require('@apollo/client');
const { setupApp } = require('../helper-functions');
const { createColor } = require('../materials/material.variables');
const {
  newColor,
  badConstructorBasicID,
  newMaterial,
  createMaterial,
  deleteAll,
  newConstructorBasic,
  getConstructorData,
  createConstructorBasic,
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
    colorId = await createColor(newColor);
    materialInput = newMaterial(colorId);
    materialID = await createMaterial(materialInput);
    constructorInput = newConstructorBasic(materialID, colorId);

    constructorBasic = await createConstructorBasic(constructorInput);
    constructorBasicId = constructorBasic._id;

    currentConstructorBasic = getConstructorData(constructorInput);
    done();
  });

  test('#1 Should return all ConstructorBasics', async done => {
    const allConstructorBasics = await operations.query({
      query: gql`
        query($limit: Int, $skip: Int) {
          getAllConstructorBasics(limit: $limit, skip: $skip) {
            items {
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
                purpose
                available
              }
              color {
                _id
                colorHex
              }
              image
            }
          }
        }
      `,
    });

    const allProducts = allConstructorBasics.data.getAllConstructorBasics.items;
    expect(allProducts).toBeDefined();
    expect(allProducts.length).toBeGreaterThan(0);
    done();
  });

  test('#2 Should return  ConstructorBasics by Id', async done => {
    const constructorBasicsById = await operations.query({
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
              }
              image
              color {
                _id
              }
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
      variables: { id: constructorBasicId },
    });

    const receivedById = constructorBasicsById.data.getConstructorBasicById;
    expect(receivedById).toBeDefined();
    expect(receivedById).toEqual({
      ...currentConstructorBasic,
      _id: constructorBasicId,
    });

    done();
  });

  test('#3 Should return  Error', async done => {
    const constructorBasicsById = await operations.query({
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
              }
              image
              color {
                _id
              }
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
      variables: { id: badConstructorBasicID },
    });

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
