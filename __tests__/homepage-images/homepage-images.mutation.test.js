const { gql } = require('@apollo/client');
const { setupApp } = require('../helper-functions');
jest.mock('../../modules/upload/upload.service');

const { invalidId, updatedLooksImage } = require('./homepage-images.variables');
const {
  IMAGES_WERE_NOT_CONVERTED,
  IMAGE_NOT_FOUND,
} = require('../../error-messages/home-page-messages');

let looksImageId;
let operations;

describe('Homepage looks images mutations', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });

  beforeAll(async () => {
    const res = await operations.mutate({
      mutation: gql`
        mutation($images: Upload!) {
          addHomePageLooksImage(images: $images) {
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
      variables: { images: '__tests__/homepage-images/img.png' },
    });

    looksImageId = res.data.addHomePageLooksImage._id;
  });

  afterAll(async () => {
    await operations.mutate({
      mutation: gql`
        mutation($id: ID!) {
          deleteHomePageLooksImage(id: $id) {
            _id
            images {
              small
            }
          }
        }
      `,
      variables: { id: looksImageId },
    });
  });

  xit('Should update looks image', async () => {
    const res = await operations.mutate({
      mutation: gql`
        mutation($id: ID!, $images: Upload) {
          updateHomePageLooksImage(id: $id, images: $images) {
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
      variables: {
        id: looksImageId,
        images: '__tests__/homepage-images/img.png',
      },
    });
    const updateResult = res.data.updateHomePageLooksImage;

    expect(updateResult).toHaveProperty('_id', looksImageId);
    expect(updateResult).toHaveProperty('images', updatedLooksImage.images);
  });

  it('Passing invalid ID should return error', async () => {
    const res = await operations.mutate({
      mutation: gql`
        mutation($id: ID!, $images: Upload) {
          updateHomePageLooksImage(id: $id, images: $images) {
            images {
              large
              medium
              small
              thumbnail
            }
          }
        }
      `,
      variables: {
        id: '5fa3e9ca2189e62008315e0n',
        images: '__tests__/homepage-images/img.png',
      },
    });
    const updateResult = res.data.updateHomePageLooksImage;
    console.log(res.data);
    expect(updateResult).toHaveProperty('message', IMAGE_NOT_FOUND);
    expect(updateResult).toHaveProperty('statusCode', 400);
    // expect(updateResult).toHaveProperty('images', updatedLooksImage.images)
  });
});
