const { gql } = require('@apollo/client');

const createModel = async (model, operations) => {
  const createdModel = await operations.mutate({
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

  return createdModel.data.addModel;
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
const addModelConstructorBasic = async (
  id,
  constructorElementID,
  operations,
) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation($id: ID!, $constructorElementID: ID!) {
        addModelConstructorBasic(
          id: $id
          constructorElementID: $constructorElementID
        ) {
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
    variables: { id, constructorElementID },
  });

  return res.data.addModelConstructorBasic;
};
const deleteModelConstructorBasic = async (
  id,
  constructorElementID,
  operations,
) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation($id: ID!, $constructorElementID: ID!) {
        deleteModelConstructorBasic(
          id: $id
          constructorElementID: $constructorElementID
        ) {
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
    variables: { id, constructorElementID },
  });

  return res.data.deleteModelConstructorBasic;
};
const addModelConstructorPattern = async (
  id,
  constructorElementID,
  operations,
) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation($id: ID!, $constructorElementID: ID!) {
        addModelConstructorPattern(
          id: $id
          constructorElementID: $constructorElementID
        ) {
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
    variables: { id, constructorElementID },
  });

  return res.data.addModelConstructorPattern;
};
const deleteModelConstructorPattern = async (
  id,
  constructorElementID,
  operations,
) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation($id: ID!, $constructorElementID: ID!) {
        deleteModelConstructorPattern(
          id: $id
          constructorElementID: $constructorElementID
        ) {
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
    variables: { id, constructorElementID },
  });

  return res.data.deleteModelConstructorPattern;
};
const addModelConstructorFrontPocket = async (
  id,
  constructorElementID,
  operations,
) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation($id: ID!, $constructorElementID: ID!) {
        addModelConstructorFrontPocket(
          id: $id
          constructorElementID: $constructorElementID
        ) {
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
    variables: { id, constructorElementID },
  });

  return res.data.addModelConstructorFrontPocket;
};
const deleteModelConstructorFrontPocket = async (
  id,
  constructorElementID,
  operations,
) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation($id: ID!, $constructorElementID: ID!) {
        deleteModelConstructorFrontPocket(
          id: $id
          constructorElementID: $constructorElementID
        ) {
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
    variables: { id, constructorElementID },
  });

  return res.data.deleteModelConstructorFrontPocket;
};
const addModelConstructorBottom = async (
  id,
  constructorElementID,
  operations,
) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation($id: ID!, $constructorElementID: ID!) {
        addModelConstructorBottom(
          id: $id
          constructorElementID: $constructorElementID
        ) {
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
    variables: { id, constructorElementID },
  });

  return res.data.addModelConstructorBottom;
};
const deleteModelConstructorBottom = async (
  id,
  constructorElementID,
  operations,
) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation($id: ID!, $constructorElementID: ID!) {
        deleteModelConstructorBottom(
          id: $id
          constructorElementID: $constructorElementID
        ) {
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
    variables: { id, constructorElementID },
  });

  return res.data.deleteModelConstructorBottom;
};
const deleteModel = async (id, operations) => {
  const deletedModel = await operations.mutate({
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

  return deletedModel.data.deleteModel;
};

const getAllModels = async (filter, pagination, sort, operations) => {
  const res = await operations.query({
    query: gql`
      query(
        $filter: ModelFilterInput
        $pagination: Pagination
        $sort: ModelSortInput
      ) {
        getAllModels(filter: $filter, pagination: $pagination, sort: $sort) {
          items {
            _id
            name {
              lang
              value
            }
            description {
              lang
              value
            }
            category {
              name {
                value
                lang
              }
            }
            images {
              large
              medium
              small
              thumbnail
            }
          }
        }
      }
    `,
    variables: { filter, pagination, sort },
  });

  return res.data.getAllModels;
};

const getModelsByCategory = async (category, operations) => {
  const result = await operations.query({
    query: gql`
      query($category: ID!) {
        getModelsByCategory(id: $category) {
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
      category,
    },
  });

  if (result.data.getModelsByCategory === null) {
    return result.errors[0].message;
  }

  return result.data.getModelsByCategory;
};
const getModelById = async (id, operations) => {
  const result = await operations.query({
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

  return result.data.getModelById;
};

module.exports = {
  createModel,
  deleteModel,
  getAllModels,
  getModelsByCategory,
  getModelById,
  updateModel,
  addModelConstructorBasic,
  deleteModelConstructorBasic,
  addModelConstructorPattern,
  deleteModelConstructorPattern,
  addModelConstructorFrontPocket,
  deleteModelConstructorFrontPocket,
  addModelConstructorBottom,
  deleteModelConstructorBottom,
};
