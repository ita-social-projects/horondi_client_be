const { gql } = require('@apollo/client');
const { setupApp } = require('../helper-functions');
const { createSize, deleteSize } = require('./size.variables');
const { SIZES_TO_CREATE, SIZES_TO_TEST } = require('./size.variables');

let operations;
let sizeId1;
let sizeId2;

jest.useFakeTimers();

describe('Sizes queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
    sizeId1 = await createSize(SIZES_TO_CREATE.size1);
    sizeId2 = await createSize(SIZES_TO_CREATE.size2);
  });

  test('should recieve all sizes', async () => {
    const result = await operations.query({
      query: gql`
        query {
          getAllSizes {
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
      `,
    });
    expect(result.data.getAllSizes[0]).toEqual(SIZES_TO_TEST.size1);
    expect(result.data.getAllSizes[1]).toEqual(SIZES_TO_TEST.size2);
  });

  test('should recieve sizes by ID', async () => {
    const result = await operations.query({
      query: gql`
        query($id: ID!) {
          getSizeById(id: $id) {
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
      `,
      variables: {
        id: sizeId1,
      },
    });

    expect(result.data.getSizeById).toEqual({
      _id: sizeId1,
      ...SIZES_TO_TEST.size1,
    });
  });

  afterAll(async () => {
    await deleteSize(sizeId1);
    await deleteSize(sizeId2);
  });
});
