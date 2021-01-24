const { gql } = require('@apollo/client');
const { setupApp } = require('../helper-functions');

const {
  newColor,
  badConstructorBasicID,
  newMaterial,
  createMaterial,
  createColorMy,
  deleteAll,
  newConstructorBasic,
  getConstructorData,
  createConstructorBasic,
} = require('./constructor-basic.variables');

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
    colorId = await createColorMy(newColor);
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

    const receivedError =
      constructorBasicsById.data.getConstructorBasicById.statusCode;
    expect(receivedError).toBe(404);
    done();
  });
  afterAll(async done => {
    await deleteAll(colorId, materialID, constructorBasicId);
    done();
  });
});
