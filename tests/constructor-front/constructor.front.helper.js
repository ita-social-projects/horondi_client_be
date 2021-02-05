const { gql } = require('@apollo/client');

const createConstructorFrontPocket = async (constructorElement, operations) => {
  const constructorFrontPocket = await operations.mutate({
    mutation: gql`
      mutation($constructorElement: ConstructorFrontPocketInput!) {
        addConstructorFrontPocket(constructorElement: $constructorElement) {
          ... on ConstructorFrontPocket {
            _id
            name {
              lang
              value
            }
            material {
              _id
            }
            color {
              _id
            }
            image
            available
            default
          }
          ... on Error {
            statusCode
            message
          }
        }
      }
    `,
    variables: { constructorElement },
  });
  return constructorFrontPocket.data.addConstructorFrontPocket;
};
const deleteConstructorFrontPocket = async (id, operations) => {
  return await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        deleteConstructorFrontPocket(id: $id) {
          ... on ConstructorFrontPocket {
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
const updateConstructorFrontPocket = async (
  constructorInput,
  constructorId,
  operations
) => {
  const constructorFrontPocket = await operations.mutate({
    mutation: gql`
      mutation($id: ID!, $constructorElement: ConstructorFrontPocketInput!) {
        updateConstructorFrontPocket(
          id: $id
          constructorElement: $constructorElement
        ) {
          ... on ConstructorFrontPocket {
            _id
            name {
              lang
              value
            }
            material {
              _id
            }
            color {
              _id
            }
            image
            available
            default
          }
          ... on Error {
            statusCode
            message
          }
        }
      }
    `,
    variables: { constructorElement: constructorInput, id: constructorId },
  });
  return constructorFrontPocket.data.updateConstructorFrontPocket;
};

const getAllConstructorFrontPocket = async operations => {
  const res = await operations.query({
    query: gql`
      query($limit: Int, $skip: Int) {
        getAllConstructorFrontPocket(limit: $limit, skip: $skip) {
          items {
            _id
            name {
              lang
              value
            }
            material {
              _id
              name {
                lang
                value
              }
              purpose
              available
            }
            color {
              _id
              colorHex
            }
            image
          }
        }
      }
    `,
  });
  return res.data.getAllConstructorFrontPocket;
};
const getConstructorFrontPocketById = async (id, operations) => {
  const res = await operations.query({
    query: gql`
      query($id: ID!) {
        getConstructorFrontPocketById(id: $id) {
          ... on ConstructorFrontPocket {
            _id
            name {
              lang
              value
            }
            material {
              _id
            }
            image
            color {
              _id
            }
            available
            default
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
  return res.data.getConstructorFrontPocketById;
};

module.exports = {
  createConstructorFrontPocket,
  deleteConstructorFrontPocket,
  getAllConstructorFrontPocket,
  getConstructorFrontPocketById,
  updateConstructorFrontPocket,
};
