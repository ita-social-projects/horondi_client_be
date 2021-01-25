const { gql } = require('@apollo/client');

const createConstructorBasic = async (constructorElement, operations) => {
  const createdConstructorBasic = await operations.mutate({
    mutation: gql`
      mutation($constructorElement: ConstructorBasicInput!) {
        addConstructorBasic(constructorElement: $constructorElement) {
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
      constructorElement,
    },
  });

  return createdConstructorBasic.data.addConstructorBasic._id;
};
const deleteConstructorBasic = async (id, operations) => {
  await operations.mutate({
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

module.exports = {
  createConstructorBasic,
  deleteConstructorBasic,
};
