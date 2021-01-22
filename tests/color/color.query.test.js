const { gql } = require('@apollo/client');
const { createdColor } = require('./color.variables');
const { wrongID, color, error_not_found } = require('./color.variables');
const { setupApp } = require('../helper-functions');

let operations;
let colorId;

describe('Colors queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
    colorId = await createdColor(color);
  });

  test('Should recive all colors', async () => {
    const getAll = await operations.query({
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

    expect(getAll.data.getAllColors).toContainEqual({
      _id: colorId,
      ...color,
    });
  });

  test('Should get color by it ID', async () => {
    const getById = await operations.query({
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
    expect(getById.data.getColorById).toEqual({
      _id: colorId,
      ...color,
    });
  });

  test('Should recive error message COLOR_NOT_FOUND while getting by wrong ID', async () => {
    const getByIdErrorMessage = await operations.query({
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
        id: wrongID,
      },
    });
    expect(getByIdErrorMessage.data.getColorById).toEqual(error_not_found);
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
