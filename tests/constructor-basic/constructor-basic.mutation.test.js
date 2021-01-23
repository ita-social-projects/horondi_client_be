const { gql, disableExperimentalFragmentVariables } = require('@apollo/client');
const { setupApp } = require('../helper-functions');

const {
  newColor,
  badConstructorBasicID,
  newMaterial,
  createMaterial,
  createColor,
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
let constructorBasicID;
let currentConstructorBasic = {};
jest.mock('../../modules/currency/currency.utils.js');

describe('constructor mutations', () => {
  beforeAll(async done => {
    operations = await setupApp();
    colorId = await createColor(newColor);
    materialInput = newMaterial(colorId);
    materialID = await createMaterial(materialInput);
    constructorInput = newConstructorBasic(materialID);
    //ConstructorBasic =  await createConstructorBasic(constructorInput);

    currentConstructorBasic = getConstructorData(constructorInput);
    done();
  });
  test('add Constructor Basic', async done => {
    const constructorInput = newConstructorBasic(materialID);
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
              available
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
    const createdConstructorBasic = createConstructor.data.addConstructorBasic;
    const a = currentConstructorBasic;
    expect(createdConstructorBasic).toBeDefined();
    expect(createConstructor.data.addConstructorBasic).toEqual({
      ...currentConstructorBasic,
      _id: constructorBasicID,
    });
    done();
    console.log(createConstructor.data.addConstructorBasic);
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
  });
  test('#2 ConstructorBasic should return Error ConstructorBasic already exist', async done => {
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
    console.log(createConstructorF);
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
    expect(error).toEqual('BASIC_ALREADY_EXIST');
    done();
  });
  test('#4 UpdateProduct should return BASIC_NOT_FOUND', async done => {
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
    expect(result).toBe('BASIC_NOT_FOUND');
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
    expect(result).toBe('BASIC_NOT_FOUND');
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
    await deleteAll(colorId, materialID, constructorBasicID);
    done();
  });
});
