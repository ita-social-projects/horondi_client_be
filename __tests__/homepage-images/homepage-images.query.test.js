const { gql } = require('@apollo/client');
const { setupApp } = require('../helper-functions');
jest.mock('../../modules/upload/upload.service');

const { looksImage } = require('./homepage-images.variables');

let looksImageId;
let operations;

describe('Homepage looks images queries', () => {
  beforeAll(async () => {
    operations = await setupApp();

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
      variables: { id: looksImageId },
    });
  });

  it('Should receive all looks images', async () => {
    const res = await operations.query({
      query: gql`
        query {
          getHomePageLooksImages {
            _id
            images {
              large
              medium
              small
              thumbnail
            }
          }
        }
      `,
    });

    const getHomePageLooksImages = res.data.getHomePageLooksImages;

    expect(getHomePageLooksImages).toBeDefined();
    expect(getHomePageLooksImages[0]).toHaveProperty(
      'images',
      looksImage.images
    );
  });
});
