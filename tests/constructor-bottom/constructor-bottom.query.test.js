const { gql } = require('@apollo/client');
const { setupApp } = require('../helper-functions');

const {
  wrongID,
  color,
  newMaterial,
  createMaterial,
  createColor,
  newConstructorBottom,
  deleteAll,
  createConstructorBottomQuery,
} = require('./constructor-bottom.variables');

let operations;
let colorId;
let materialInput;
let materialId;
let addConstructor;
let newConstructorForQuery;

describe('Constructor query', () => {
  beforeAll(async () => {
    operations = await setupApp();
    colorId = await createColor(color);
    materialInput = newMaterial(colorId);
    materialId = await createMaterial(materialInput);
    addConstructor = newConstructorBottom(colorId, materialId);
    newConstructorForQuery = await createConstructorBottomQuery(addConstructor);
  });
  afterAll(async () => {
    await deleteAll(colorId, materialId, newConstructorForQuery);
  });
  test('should return constructor-bottom by Id', async () => {
    const constructorBottomById = await operations.query({
      query: gql`
        query($id: ID!) {
          getConstructorBottomById(id: $id) {
            ... on ConstructorBottom {
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
      variables: { id: newConstructorForQuery },
    });

    const receivedById = constructorBottomById.data.getConstructorBottomById;
    expect(receivedById).toBeDefined();
  });
  test('should return error when try to get constructor-bottom by wrong ID', async () => {
    const constructorBottomById = await operations.query({
      query: gql`
        query($id: ID!) {
          getConstructorBottomById(id: $id) {
            ... on ConstructorBottom {
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
      variables: { id: wrongID },
    });
    const receivedError = constructorBottomById.data.getConstructorBottomById;
    expect(receivedError.statusCode).toBe(404);
  });
});
