const { gql } = require('@apollo/client');

const createSize = async (size, operations) => {
  const createdSize = await operations.mutate({
    mutation: gql`
      mutation($size: SizeInput!) {
        addSize(size: $size) {
          ... on Size {
            _id
          }
          ... on Error {
            message
          }
        }
      }
    `,
    variables: {
      size,
    },
  });

  return createdSize.data.addSize._id;
};
const deleteSize = async (id, operations) => {
  await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        deleteSize(id: $id) {
          ... on Size {
            _id
          }
          ... on Error {
            message
          }
        }
      }
    `,
    variables: {
      id,
    },
  });
};

module.exports = {
  deleteSize,
  createSize,
};
