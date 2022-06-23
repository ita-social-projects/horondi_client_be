const { gql } = require('@apollo/client');

const createBack = async (back, image, operations) => {
  const backInfo = await operations.mutate({
    mutation: gql`
      mutation ($back: BackInput!, $image: Upload) {
        addBack(back: $back, image: $image) {
          ... on Back {
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
            model {
              _id
            }
            available
            customizable
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
    variables: { back, image },
  });

  return backInfo.data.addBack;
};
const updateBack = async (id, back, image, operations) => {
  const backInfo = await operations.mutate({
    mutation: gql`
      mutation ($id: ID!, $back: BackInput!, $image: Upload) {
        updateBack(id: $id, back: $back, image: $image) {
          ... on Back {
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
            model {
              _id
            }
            absolutePrice
            available
            customizable
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
      back,
      image,
    },
  });

  return backInfo.data.updateBack;
};
const getAllBacks = async ({ limit, skip, filter }, operations) => {
  const backInfo = await operations.query({
    query: gql`
      query ($limit: Int!, $skip: Int!, $filter: BackFilterInput) {
        getAllBacks(limit: $limit, skip: $skip, filter: $filter) {
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
            model {
              _id
            }
            absolutePrice
            available
            customizable
            optionType
          }
        }
      }
    `,
    variables: { limit, skip, filter },
  });

  return backInfo.data.getAllBacks.items;
};
const getBackById = async (id, operations) => {
  const backInfo = await operations.query({
    query: gql`
      query ($id: ID!) {
        getBackById(id: $id) {
          ... on Back {
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
            model {
              _id
            }
            images {
              small
              medium
              large
              thumbnail
            }
            absolutePrice
            available
            customizable
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

  return backInfo.data.getBackById;
};
const getBacksByModel = async (id, operations) => {
  const backInfo = await operations.query({
    query: gql`
      query ($id: ID!) {
        getBacksByModel(id: $id) {
          ... on Back {
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
            model {
              _id
            }
            available
            customizable
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

  return backInfo.data.getBacksByModel;
};
const deleteBack = async (id, operations) => {
  const backInfo = await operations.mutate({
    mutation: gql`
      mutation ($id: ID!) {
        deleteBack(id: $id) {
          ... on Back {
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

  return backInfo.data.deleteBack;
};

module.exports = {
  deleteBack,
  createBack,
  getAllBacks,
  getBackById,
  updateBack,
  getBacksByModel,
};
