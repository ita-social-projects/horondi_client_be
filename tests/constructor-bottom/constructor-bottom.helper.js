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
        }
      }
    `,
    variables: { constructorElement: addConstructor },
  });
  return constructorBottom.data.addConstructorBottom;
};

const updateConstructorBottom = async (
  constructorId,
  operations,
  newDataConstructorBottom
) => {
  const updateConstructor = await operations.mutate({
    mutation: gql`
      mutation($id: ID!, $constructorElement: ConstructorBottomInput!) {
        updateConstructorBottom(
          id: $id
          constructorElement: $constructorElement
        ) {
          ... on ConstructorBottom {
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
    variables: {
      constructorElement: newDataConstructorBottom,
      id: constructorId,
    },
  });
  return updateConstructor.data.updateConstructorBottom;
};
const createConstructorBottomAgain = async (
  newDataConstructorBottom,
  operations
) => {
  const createConstructorAgain = await operations.mutate({
    mutation: gql`
      mutation($constructorElement: ConstructorBottomInput!) {
        addConstructorBottom(constructorElement: $constructorElement) {
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
    variables: { constructorElement: newDataConstructorBottom },
  });
  return createConstructorAgain.data.addConstructorBottom.message;
};

const updateConstructorB = async (wrongID, operations, addConstructor) => {
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
      id: wrongID,
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
module.exports = {
  updateConstructorBottom,
  createConstructorBottom,
  createConstructorBottomAgain,
  updateConstructorB,
  deleteConstructorBottom,
};
