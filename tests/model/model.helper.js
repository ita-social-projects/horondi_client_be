const { gql } = require('@apollo/client');

const createModel = async (model, operations) => {
  const createModel = await operations.mutate({
    mutation: gql`
      mutation($model: ModelInput!) {
        addModel(model: $model) {
          ... on Model {
            _id
            name {
              value
              lang
            }
            description {
              value
              lang
            }
            images {
              large
              medium
              small
              thumbnail
            }
            category {
              name {
                value
                lang
              }
            }
          }
          ... on Error {
            message
            statusCode
          }
        }
      }
    `,
    variables: { model },
  });

  return createModel.data.addModel;
};
const updateModel = async (id, model, operations) => {
  const updatedModel = await operations.mutate({
    mutation: gql`
      mutation($model: ModelInput!, $id: ID!) {
        updateModel(id: $id, model: $model) {
          ... on Model {
            name {
              value
              lang
            }
            description {
              value
              lang
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
      model,
      id,
    },
  });

  return updatedModel.data.updateModel;
};
const deleteModel = async (id, operations) => {
  const deleteModel = await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        deleteModel(id: $id) {
          ... on Model {
            _id
            name {
              value
              lang
            }
            description {
              value
              lang
            }
          }
          ... on Error {
            statusCode
            message
          }
        }
      }
    `,
    variables: { id },
  });

  return deleteModel.data.deleteModel;
};
const getModelsByCategory = async (category, operations) => {
  return await operations.query({
    query: gql`
      query($category: ID!) {
        getModelsByCategory(id: $category) {
          category {
            _id
          }
          name {
            value
            lang
          }
          description {
            value
            lang
          }
          images {
            large
            medium
            small
            thumbnail
          }
        }
      }
    `,
    variables: {
      category,
    },
  });
};
const getModelById = async (id, operations) => {
  return await operations.query({
    query: gql`
      query($id: ID!) {
        getModelById(id: $id) {
          ... on Model {
            category {
              _id
            }
            name {
              value
              lang
            }
            description {
              value
              lang
            }
            images {
              large
              medium
              small
              thumbnail
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
};

module.exports = {
  createModel,
  deleteModel,
  getModelsByCategory,
  getModelById,
  updateModel,
};
