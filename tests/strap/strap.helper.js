const { gql } = require('@apollo/client');

const createStrap = async (strap, operations) => {
  const createdStrap = await operations.mutate({
    mutation: gql`
      mutation($strap: StrapInput!) {
        addStrap(strap: $strap) {
          ... on Strap {
            _id
            name {
              lang
              value
            }
            optionType
            model {
              _id
            }
            features {
              color {
                _id
              }
            }
            image
            available
            customizable
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
      strap,
    },
  });

  return createdStrap.data.addStrap;
};

const updateStrap = async (id, strap, operations) => {
  const updatedStrap = await operations.mutate({
    mutation: gql`
      mutation($id: ID!, $strap: StrapInput!) {
        updateStrap(id: $id, strap: $strap) {
          ... on Strap {
            _id
            name {
              lang
              value
            }
            optionType
            model {
              _id
            }
            features {
              color {
                _id
              }
            }
            image
            available
            customizable
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
      strap,
      id,
    },
  });

  return updatedStrap.data.updateStrap;
};

const deleteStrap = async (id, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        deleteStrap(id: $id) {
          ... on Strap {
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

  return res.data.deleteStrap;
};

const getStrapById = async (id, operations) => {
  const result = await operations.query({
    query: gql`
      query($id: ID!) {
        getStrapById(id: $id) {
          ... on Strap {
            _id
            name {
              lang
              value
            }
            optionType
            model {
              _id
            }
            features {
              color {
                _id
              }
            }
            image
            available
            customizable
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
    },
  });
  return result.data.getStrapById;
};

const getStrapsByModel = async (id, operations) => {
  const result = await operations.query({
    query: gql`
      query($id: ID!) {
        getStrapsByModel(id: $id) {
          ... on Strap {
            _id
            name {
              lang
              value
            }
            optionType
            model {
              _id
            }
            features {
              color {
                _id
              }
            }
            image
            available
            customizable
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

  return result.data.getStrapsByModel;
};

const getAllStraps = async (limit, skip, filter, operations) => {
  const result = await operations.query({
    query: gql`
      query($limit: Int!, $skip: Int!, $filter: StrapFilterInput) {
        getAllStraps(limit: $limit, skip: $skip, filter: $filter) {
          items {
            _id
            name {
              lang
              value
            }
            optionType
            model {
              _id
            }
            features {
              color {
                _id
              }
            }
            image
            available
            customizable
            additionalPrice {
              currency
              value
            }
          }
        }
      }
    `,
    variables: {
      limit,
      skip,
      filter,
    },
  });

  return result.data.getAllStraps;
};

module.exports = {
  deleteStrap,
  createStrap,
  getStrapById,
  getStrapsByModel,
  getAllStraps,
  updateStrap,
};
