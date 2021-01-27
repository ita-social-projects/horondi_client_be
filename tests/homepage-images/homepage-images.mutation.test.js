const { gql } = require('@apollo/client');
const { setupApp } = require('../helper-functions');
jest.mock('../../modules/upload/upload.service');

const { invalidId } = require('./homepage-images.variables');
const { IMAGE_NOT_FOUND } = require('../../error-messages/home-page-messages');

let looksImageId;
let operations;

describe('Homepage looks images mutations', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });

  beforeAll(async () => {
    const res = await operations.mutate({
      mutation: gql`
        mutation($images: Upload) {
          addHomePageLooksImage(images: $images) {
            ... on HomePageImages {
              _id
              images {
                large
                medium
                small
                thumbnail
              }
            }
            ... on Error {
              statusCode
              message
            }
          }
        }
      `,
      variables: { images: '__tests__/homepage-images/img.png' },
    });

    looksImageId = res.data.addHomePageLooksImage._id;
  });

  afterAll(async () => {
    await operations.mutate({
      mutation: gql`
        mutation($id: ID!) {
          deleteHomePageLooksImage(id: $id) {
            ... on HomePageImages {
              _id
            }
            ... on Error {
              statusCode
              message
            }
          }
        }
      `,
      variables: { id: looksImageId },
    });
  });

  it('Passing invalid ID should return error', async () => {
    const res = await operations.mutate({
      mutation: gql`
        mutation($id: ID!, $images: Upload) {
          updateHomePageLooksImage(id: $id, images: $images) {
            ... on HomePageImages {
              images {
                large
                medium
                small
                thumbnail
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
        id: invalidId,
        images: '__tests__/homepage-images/img.png',
      },
    });
    const updateResult = res.data.updateHomePageLooksImage;

    expect(updateResult).toHaveProperty('message', IMAGE_NOT_FOUND);
    expect(updateResult).toHaveProperty('statusCode', 400);
  });
});
