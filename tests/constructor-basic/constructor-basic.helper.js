const { gql } = require('@apollo/client');

const createConstructorBasic = async (constructorElement, operations) => {
  const constructorBasic = await operations.mutate({
    mutation: gql`
      mutation($constructorElement: ConstructorBasicInput!) {
        addConstructorBasic(constructorElement: $constructorElement) {
          ... on ConstructorBasic {
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
  return constructorBasic.data.addConstructorBasic;
};
const deleteConstructorBasic = async (id, operations) => {
  return await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        deleteConstructorBasic(id: $id) {
          ... on ConstructorBasic {
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
const updateConstructorBasic = async (
  constructorInput,
  constructorId,
  operations
) => {
  const constructorBasic = await operations.mutate({
    mutation: gql`
      mutation($id: ID!, $constructorElement: ConstructorBasicInput!) {
        updateConstructorBasic(
          id: $id
          constructorElement: $constructorElement
        ) {
          ... on ConstructorBasic {
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
  return constructorBasic.data.updateConstructorBasic;
};
const getAllConstructorBasics = async operations => {
  const res = await operations.query({
    query: gql`
      query($limit: Int, $skip: Int) {
        getAllConstructorBasics(limit: $limit, skip: $skip) {
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
          }
        }
      }
    `,
  });
  return res.data.getAllConstructorBasics;
};
const getConstructorBasicById = async (id, operations) => {
  const constructorBasicById = await operations.query({
    query: gql`
      query($id: ID!) {
        getConstructorBasicById(id: $id) {
          ... on ConstructorBasic {
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
  return constructorBasicById.data.getConstructorBasicById;
};

module.exports = {
  createConstructorBasic,
  deleteConstructorBasic,
  getAllConstructorBasics,
  getConstructorBasicById,
  updateConstructorBasic,
};
