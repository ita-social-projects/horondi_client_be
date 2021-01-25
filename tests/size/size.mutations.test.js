const { gql } = require('@apollo/client');
const { setupApp } = require('../helper-functions');
const {
  SIZES_TO_CREATE,
  SIZES_TO_TEST,
  WRONG_ID,
  ERROR_ALREDY_EXISTS,
  ERROR_NOT_FOUND,
} = require('./size.variables');

let operations;
let sizeId;
let size_updated;

describe('Sizes mutations', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });

  xtest('should add size', async () => {
    const result = await operations.mutate({
      mutation: gql`
        mutation($size: SizeInput!) {
          addSize(size: $size) {
            ... on Size {
              _id
              name
              heightInCm
              widthInCm
              depthInCm
              volumeInLiters
              weightInKg
              available
              additionalPrice {
                currency
                value
              }
            }
          }
        }
      `,
      variables: {
        size: SIZES_TO_CREATE.size1,
      },
    });

    sizeId = result.data.addSize._id;

    expect(result.data.addSize).toEqual({
      _id: sizeId,
      ...SIZES_TO_TEST.size1,
    });
  });

  xtest('should recieve error SIZE_ALREADY_EXIST', async () => {
    const result = await operations.mutate({
      mutation: gql`
        mutation($size: SizeInput!) {
          addSize(size: $size) {
            ... on Error {
              statusCode
              message
            }
          }
        }
      `,
      variables: {
        size: SIZES_TO_CREATE.size1,
      },
    });
    expect(result.data.addSize).toEqual({
      ...ERROR_ALREDY_EXISTS,
    });
  });

  test('should update size by ID and input', async () => {
    const result = await operations.mutate({
      mutation: gql`
        mutation($id: ID!, $size: SizeInput!) {
          updateSize(id: $id, size: $size) {
            ... on Size {
              _id
              name
              heightInCm
              widthInCm
              depthInCm
              volumeInLiters
              weightInKg
              available
              additionalPrice {
                currency
                value
              }
            }
            ... on Error {
              statusCode
              message
            }
          }
        }
      `,
      variables: {
        id: sizeId,
        size: SIZES_TO_CREATE.size2,
      },
    });

    size_updated = result.data.updateSize;

    expect(result.data.updateSize).toEqual({
      _id: sizeId,
      ...SIZES_TO_TEST.size2,
    });
  });

  xtest('should receive error message SIZE_NOT_FOUND', async () => {
    const result = await operations.mutate({
      mutation: gql`
        mutation($id: ID!, $size: SizeInput!) {
          updateSize(id: $id, size: $size) {
            ... on Error {
              statusCode
              message
            }
          }
        }
      `,
      variables: {
        id: WRONG_ID,
        size: SIZES_TO_CREATE.size1,
      },
    });
    expect(result.data.addSize).toEqual({
      ...ERROR_NOT_FOUND,
    });
  });

  xtest('Should delete size by ID', async () => {
    const result = await operations.mutate({
      mutation: gql`
        mutation($id: ID!) {
          deleteSize(id: $id) {
            ... on Size {
              _id
              name
              heightInCm
              widthInCm
              depthInCm
              volumeInLiters
              weightInKg
              available
              additionalPrice {
                currency
                value
              }
            }
          }
        }
      `,
      variables: {
        id: sizeId,
      },
    });

    expect(result.data.deleteSize).toEqual({
      ...size_updated,
    });
  });

  xtest('should recieve error SIZE_NOT_FOUND', async () => {
    const result = await operations.mutate({
      mutation: gql`
        mutation($id: ID!) {
          deleteSize(id: $id) {
            ... on Error {
              statusCode
              message
            }
          }
        }
      `,
      variables: {
        id: WRONG_ID,
        size: SIZES_TO_CREATE.size1,
      },
    });
    expect(result.data.deleteSize).toEqual(ERROR_NOT_FOUND);
  });
});
