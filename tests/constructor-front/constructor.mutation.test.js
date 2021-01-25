const { gql } = require('@apollo/client');
const { setupApp } = require('../helper-functions');
const {
  FRONT_POCKET_NOT_FOUND,
} = require('../../error-messages/constructor-front-pocket-messages');
const {
  badConstructorFrontID,
  newColor,
  newMaterial,
  getConstructorData,
  createMaterial,
  createConstructorFrontPocket,
} = require('./constructor.variables');

const { createColor } = require('../materials/material.variables');

let operations;
let colorIdMy;
let materialInput;
let materialID;
let constructorInput;
let constructorFrontID;
let currentConstructorFront = {};
let construrtorIDafter;
let constructorUpdateInput;
jest.mock('../../modules/currency/currency.utils.js');

describe('constructor mutations', () => {
  beforeAll(async done => {
    operations = await setupApp();
    colorIdMy = await createColor(newColor);
    materialInput = newMaterial(colorIdMy);
    materialID = await createMaterial(materialInput);
    constructorInput = newConstructorFront(materialID, colorIdMy);

    constructorUpdateInput = getConstructorDataForUpt(constructorInput);
    currentConstructorFront = getConstructorData(constructorInput);
    done();
  });
  test('#1 Should add Constructor Front Pocket', async done => {
    const createConstructor = await operations.mutate({
      mutation: gql`
        mutation($constructorElement: ConstructorFrontPocketInput!) {
          addConstructorFrontPocket(constructorElement: $constructorElement) {
            ... on ConstructorFrontPocket {
              _id
              available
              default
              basePrice {
                value
              }
              name {
                value
              }
              image
              material {
                name {
                  value
                }
              }
              color {
                colorHex
                _id
              }
            }
            ... on Error {
              message
              statusCode
            }
          }
        }
      `,
      variables: { constructorElement: constructorInput },
    });

    constructorFrontID = createConstructor.data.addConstructorFrontPocket._id;
    expect(createConstructor.data.addConstructorFrontPocket).toBeDefined();
    expect(createConstructor.data.addConstructorFrontPocket).toEqual({
      ...addConstructorFrontPocket,
      _id: addConstructorFrontPocket,
    });
    const getConstructorFrontPocket = await operations.query({
      query: gql`
        query($id: ID!) {
          getConstructorFrontPocketById(id: $id) {
            ... on ConstructorFrontPocket {
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
              color {
                colorHex
              }
              available
            }
          }
        }
      `,
      variables: { id: constructorFrontID },
    });

    const receivedConstructorFront =
      getConstructorFrontPocket.data.getConstructorFrontById;
    expect(receivedConstructorFront).toBeDefined();
    expect(createConstructor.data.addConstructorFrontPocket).toEqual({
      ...currentConstructorFront,
      _id: constructorFrontID,
    });
    done();
  });
});
