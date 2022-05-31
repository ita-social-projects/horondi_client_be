const { gql } = require('@apollo/client');

const createBottom = async (bottom, image, operations) => {
  const bottomInfo = await operations.mutate({
    mutation: gql`
      mutation ($bottom: BottomInput!, $image: Upload) {
        addBottom(bottom: $bottom, image: $image) {
          ... on Bottom {
            _id
            name {
              lang
              value
            }
            features {
              material {
                _id
              }
              color {
                _id
              }
            }
            images {
              small
              medium
              large
              thumbnail
            }
            available
            optionType
            absolutePrice
            translationsKey
          }
          ... on Error {
            message
            statusCode
          }
        }
      }
    `,
    variables: { bottom, image },
  });

  return bottomInfo.data.addBottom;
};
const updateBottom = async (id, bottom, image, operations) => {
  const bottomInfo = await operations.mutate({
    mutation: gql`
      mutation ($id: ID!, $bottom: BottomInput!, $image: Upload) {
        updateBottom(id: $id, bottom: $bottom, image: $image) {
          ... on Bottom {
            _id
            name {
              lang
              value
            }
            features {
              material {
                _id
              }
              color {
                _id
              }
            }
            images {
              small
              medium
              large
              thumbnail
            }
            available
            optionType
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
      bottom,
      image,
    },
  });

  return bottomInfo.data.updateBottom;
};
const getAllBottoms = async ({ limit, skip, filter }, operations) => {
  const bottomInfo = await operations.query({
    query: gql`
      query ($limit: Int!, $skip: Int!, $filter: BottomFilterInput) {
        getAllBottoms(limit: $limit, skip: $skip, filter: $filter) {
          items {
            _id
            name {
              lang
              value
            }
            features {
              material {
                _id
              }
              color {
                _id
              }
            }
            available
            optionType
          }
        }
      }
    `,
    variables: { limit, skip, filter },
  });

  return bottomInfo.data.getAllBottoms.items;
};
const getBottomById = async (id, operations) => {
  const bottomInfo = await operations.query({
    query: gql`
      query ($id: ID!) {
        getBottomById(id: $id) {
          ... on Bottom {
            _id
            name {
              lang
              value
            }
            features {
              material {
                _id
              }
              color {
                _id
              }
            }
            images {
              small
              medium
              large
              thumbnail
            }
            available
            optionType
          }
          ... on Error {
            message
            statusCode
          }
        }
      }
    `,
    variables: { id },
  });

  return bottomInfo.data.getBottomById;
};
const deleteBottom = async (id, operations) => {
  const bottomInfo = await operations.mutate({
    mutation: gql`
      mutation ($id: ID!) {
        deleteBottom(id: $id) {
          ... on Bottom {
            _id
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

  return bottomInfo.data.deleteBottom;
};

module.exports = {
  deleteBottom,
  createBottom,
  getAllBottoms,
  getBottomById,
  updateBottom,
};
