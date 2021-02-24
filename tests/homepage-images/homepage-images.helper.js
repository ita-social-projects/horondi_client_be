const { gql } = require('@apollo/client');

const addHomePageLooksImage = async operations => {
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

  return res.data.addHomePageLooksImage._id;
};
const updateHomePageLooksImage = async (id, operations) => {
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
      id,
      images: '__tests__/homepage-images/img.png',
    },
  });
  return res.data.updateHomePageLooksImage;
};
const deleteHomePageLooksImage = async (id, operations) => {
  return await operations.mutate({
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
    variables: { id },
  });
};
const getHomePageImages = async operations => {
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

  return res.data.getHomePageLooksImages;
};

module.exports = {
  addHomePageLooksImage,
  deleteHomePageLooksImage,
  getHomePageImages,
  updateHomePageLooksImage,
};
