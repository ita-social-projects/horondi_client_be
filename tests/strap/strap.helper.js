const { gql } = require('@apollo/client');

const createStrap = async (strap, image, operations) => {
  const createdStrap = await operations.mutate({
    mutation: gql`
      mutation($strap: StrapInput!, $image: Upload) {
        addStrap(strap: $strap, image: $image) {
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
              type
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
      image,
    },
  });

  return createdStrap.data.addStrap;
};

const updateStrap = async (id, strap, image, operations) => {
  const updatedStrap = await operations.mutate({
    mutation: gql`
      mutation($id: ID!, $strap: StrapInput!, $image: Upload) {
        updateStrap(id: $id, strap: $strap, image: $image) {
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
              type
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
      image,
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
              type
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
              type
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
              type
              value
            }
          }
          count
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
