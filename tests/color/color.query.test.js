const { gql } = require('@apollo/client');
const { createColor } = require('./color.variables');
const { WRONG_ID, COLOR, ERROR_NOT_FOUND } = require('./color.variables');
const { setupApp } = require('../helper-functions');

let operations;
let colorId;

describe('Colors queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
    colorId = await createColor(COLOR);
  });

  test('Should recive all colors', async () => {
    const result = await operations.query({
      query: gql`
        query {
          getAllColors {
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
      `,
    });

    expect(result.data.getAllColors).toContainEqual({
      _id: colorId,
      ...COLOR,
    });
  });

  test('Should get color by it ID', async () => {
    const result = await operations.query({
      query: gql`
        query($id: ID!) {
          getColorById(id: $id) {
            ... on Color {
              _id
              colorHex
              name {
                lang
                value
              }
              simpleName {
                lang
                value
              }
            }
          }
        }
      `,
      variables: {
        id: colorId,
      },
    });
    expect(result.data.getColorById).toEqual({
      _id: colorId,
      ...COLOR,
    });
  });

  test('Should recive error message COLOR_NOT_FOUND while getting by wrong ID', async () => {
    const result = await operations.query({
      query: gql`
        query($id: ID!) {
          getColorById(id: $id) {
            ... on Error {
              statusCode
              message
            }
          }
        }
      `,
      variables: {
        id: WRONG_ID,
      },
    });
    expect(result.data.getColorById).toEqual(ERROR_NOT_FOUND);
  });

  afterAll(async () => {
    await operations.mutate({
      mutation: gql`
        mutation($id: ID!) {
          deleteColor(id: $id) {
            ... on Color {
              _id
              name {
                lang
                value
              }
            }
          }
        }
      `,
      variables: {
        id: colorId,
      },
    });
  });
});
