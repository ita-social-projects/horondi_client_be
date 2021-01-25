const { gql } = require('@apollo/client');
const { setupApp } = require('../helper-functions');
const {
  CONSTRUCTOR_BOTTOM_NOT_FOUND,
  IMAGE_NOT_FOUND,
  CONSTRUCTOR_BOTTOM_ALREADY_EXIST,
} = require('../../error-messages/constructor-bottom.messages');

const {
  color,
  newMaterial,
  createMaterial,
  createColor,
  newConstructorBottom,
  getConstructorData,
  deleteAll,
  getConstructorDataForUpt,
  wrongID,
} = require('./constructor-bottom.variables');

let operations;
let colorId;
let materialInput;
let materialId;
let addConstructor;
let constructorId;
let currentConstructorBottom;
let newDataConstructorBottom;
let result;

describe('Constructor mutations', () => {
  beforeAll(async () => {
    operations = await setupApp();
    colorId = await createColor(color);
    materialInput = newMaterial(colorId);
    materialId = await createMaterial(materialInput);
    addConstructor = newConstructorBottom(colorId, materialId);
    currentConstructorBottom = getConstructorData(addConstructor);
    newDataConstructorBottom = getConstructorDataForUpt(colorId, materialId);
  });
  afterAll(async () => {
    await deleteAll(colorId, materialId, constructorId);
  });
  test('should create constructor-bottom', async () => {
    // create constructor bottom 1) check if is define
    const createConstructorBottom = await operations.mutate({
      mutation: gql`
        mutation($constructorElement: ConstructorBottomInput!) {
          addConstructorBottom(constructorElement: $constructorElement) {
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
          }
        }
      `,
      variables: { constructorElement: addConstructor },
    });
    constructorId = createConstructorBottom.data.addConstructorBottom._id;
    result = createConstructorBottom.data.addConstructorBottom;
    expect(result).toBeDefined();
    expect(result).toEqual({
      ...currentConstructorBottom,
      _id: constructorId,
    });
  });
  test('should update existing constructor-bottom', async () => {
    const updateConstructor = await operations.mutate({
      mutation: gql`
        mutation($id: ID!, $constructorElement: ConstructorBottomInput!) {
          updateConstructorBottom(
            id: $id
            constructorElement: $constructorElement
          ) {
            ... on ConstructorBottom {
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
        constructorElement: newDataConstructorBottom,
        id: constructorId,
      },
    });
    const updatedResult = updateConstructor.data.updateConstructorBottom;
    expect(updatedResult).toBeDefined();
    expect(updatedResult.image).not.toEqual(result.image);
    expect(updatedResult.name).not.toEqual(result.name);
  });
  test('should return Error (already exist) when creating same constructor-bottom again', async () => {
    const createConstructorAgain = await operations.mutate({
      mutation: gql`
        mutation($constructorElement: ConstructorBottomInput!) {
          addConstructorBottom(constructorElement: $constructorElement) {
            ... on ConstructorBottom {
              _id
            }
            ... on Error {
              statusCode
              message
            }
          }
        }
      `,
      variables: { constructorElement: newDataConstructorBottom },
    });
    const error = createConstructorAgain.data.addConstructorBottom.message;
    expect(error).toBeDefined();
    expect(error).toEqual(CONSTRUCTOR_BOTTOM_ALREADY_EXIST);
  });
  test('should return Error (not found) when updating not existing constructor-bottom', async () => {
    const updateConstructor = await operations.mutate({
      mutation: gql`
        mutation($id: ID!, $constructorElement: ConstructorBottomInput!) {
          updateConstructorBottom(
            id: $id
            constructorElement: $constructorElement
          ) {
            ... on ConstructorBottom {
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
        id: wrongID,
        constructorElement: addConstructor,
      },
    });
    const result = updateConstructor.data.updateConstructorBottom.message;
    expect(result).toBe(CONSTRUCTOR_BOTTOM_NOT_FOUND);
  });
  test('should return Error (not found) when try to delete wrong constructor bottom', async () => {
    const deletedConstructor = await operations.mutate({
      mutation: gql`
        mutation($id: ID!) {
          deleteConstructorBottom(id: $id) {
            ... on ConstructorBottom {
              _id
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
    const result = deletedConstructor.data.deleteConstructorBottom.message;
    expect(result).toBe(CONSTRUCTOR_BOTTOM_NOT_FOUND);
  });
});
