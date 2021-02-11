const { gql } = require('@apollo/client');

const createSize = async (size, operations) => {
  const createdSize = await operations.mutate({
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
          ... on Error {
            statusCode
            message
          }
        }
      }
    `,
    variables: {
      size,
    },
  });

  return createdSize.data.addSize;
};
const deleteSize = async (id, operations) => {
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
          ... on Error {
            message
            statusCode
          }
        }
      }
    `,
    variables: {
      id,
    },
  });
  return result.data.deleteSize;
};
const getAllSizes = async operations => {
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
  return result.data.getAllSizes;
};
const getSizeById = async (id, operations) => {
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
      id,
    },
  });

  return result.data.getSizeById;
};
const updateSize = async (id, size, operations) => {
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
      id,
      size,
    },
  });
  return result.data.updateSize;
};

module.exports = {
  deleteSize,
  createSize,
  getAllSizes,
  getSizeById,
  updateSize,
};
