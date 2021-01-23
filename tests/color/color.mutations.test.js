const { gql } = require('@apollo/client');
const { setupApp } = require('../helper-functions');
const {
  WRONG_ID,
  COLOR_2,
  ERROR_NOT_FOUND,
  ERROR_ALREDY_EXISTS,
} = require('./color.variables');

let operations;
let colorId;

describe('Color mutations', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });

  test('Should add color', async () => {
    const addCol = await operations.mutate({
      mutation: gql`
        mutation($data: ColorInput!) {
          addColor(data: $data) {
            ... on Color {
              _id
              name {
                lang
                value
              }
              colorHex
              simpleName {
                lang
                value
              }
            }
          }
        }
      `,
      variables: {
        data: COLOR_2,
      },
    });

    colorId = addCol.data.addColor._id;

    expect(addCol.data.addColor).toEqual({
      _id: colorId,
      ...COLOR_2,
    });
  });

  test('Should recive error message COLOR_ALREADY_EXIST when color already in the db while creating', async () => {
    const addCol = await operations.mutate({
      mutation: gql`
        mutation($data: ColorInput!) {
          addColor(data: $data) {
            ... on Error {
              message
              statusCode
            }
          }
        }
      `,
      variables: {
        data: COLOR_2,
      },
    });
    expect(addCol.data.addColor).toEqual(ERROR_ALREDY_EXISTS);
  });

  test('Should delete color by ID', async () => {
    const deleteCol = await operations.mutate({
      mutation: gql`
        mutation($id: ID!) {
          deleteColor(id: $id) {
            ... on Color {
              _id
              name {
                value
                lang
              }
              colorHex
              simpleName {
                value
                lang
              }
            }
          }
        }
      `,
      variables: {
        id: colorId,
      },
    });
    expect(deleteCol.data.deleteColor).toEqual({
      _id: colorId,
      ...COLOR_2,
    });
  });

  test('Should recieve error message COLOR_NOT_FOUND on deleting color with wrong ID', async () => {
    const deleteCol = await operations.mutate({
      mutation: gql`
        mutation($id: ID!) {
          deleteColor(id: $id) {
            ... on Error {
              message
              statusCode
            }
          }
        }
      `,
      variables: {
        id: WRONG_ID,
      },
    });
    expect(deleteCol.data.deleteColor).toEqual(ERROR_NOT_FOUND);
  });
});
