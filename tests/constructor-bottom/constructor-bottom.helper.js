const { gql } = require('@apollo/client');
const { setupApp } = require('../helper-functions');

const createConstructorBottom = async (addConstructor, operations) => {
  const constructorBottom = await operations.mutate({
    mutation: gql`
      mutation($constructorElement: ConstructorBottomInput!) {
        addConstructorBottom(constructorElement: $constructorElement) {
          ... on ConstructorBottom {
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
    variables: { constructorElement: addConstructor },
  });
  return constructorBottom.data.addConstructorBottom;
};

const updateConstructorB = async (ID, operations, addConstructor) => {
  const updateConstructor = await operations.mutate({
    mutation: gql`
      mutation($id: ID!, $constructorElement: ConstructorBottomInput!) {
        updateConstructorBottom(
          id: $id
          constructorElement: $constructorElement
        ) {
          ... on ConstructorBottom {
            _id
          }
          ... on Error {
            statusCode
            message
          }
        }
      }
    `,
    variables: {
      id: ID,
      constructorElement: addConstructor,
    },
  });
  return updateConstructor.data.updateConstructorBottom.message;
};
const deleteConstructorBottom = async (constructorId, operations) => {
  const deletedConstructor = await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        deleteConstructorBottom(id: $id) {
          ... on ConstructorBottom {
            _id
          }
        }
      }
    `,
    variables: { id: constructorId },
  });
  return deletedConstructor.data.deleteConstructorBottom._id;
};
const getConstructorBottom = async (id, operations) => {
  const constructorBottomById = await operations.query({
    query: gql`
      query($id: ID!) {
        getConstructorBottomById(id: $id) {
          ... on ConstructorBottom {
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
    variables: { id: id },
  });
  return constructorBottomById.data.getConstructorBottomById;
};
const getAllConstructorBottom = async operations => {
  const allConstructorBottom = await operations.query({
    query: gql`
      query($limit: Int, $skip: Int) {
        getAllConstructorBottom(limit: $limit, skip: $skip) {
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
  return allConstructorBottom.data.getAllConstructorBottom.items;
};

module.exports = {
  createConstructorBottom,
  updateConstructorB,
  deleteConstructorBottom,
  getConstructorBottom,
  getAllConstructorBottom,
};
