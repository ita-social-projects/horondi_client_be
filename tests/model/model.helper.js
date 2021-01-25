const { gql } = require('@apollo/client');

const createModel = async (model, operations) => {
  const createdModel = await operations.mutate({
    mutation: gql`
      mutation($model: ModelInput!) {
        addModel(model: $model, upload: []) {
          ... on Model {
            _id
          }
          ... on Error {
            message
          }
        }
      }
    `,
    variables: {
      model,
    },
  });
  return createdModel.data.addModel._id;
};
const deleteModel = async (id, operations) => {
  await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        deleteModel(id: $id) {
          ... on Model {
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
  createModel,
  deleteModel,
};
