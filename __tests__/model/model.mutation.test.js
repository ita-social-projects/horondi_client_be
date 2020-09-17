/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const client = require('../../utils/apollo-test-client');
const {
  newCategory,
  newModelMutation,
  newModelUpdated,
} = require('./model.variables');
require('dotenv').config();

let modelId; let categoryName; let
    categoryId;
  wrongId,
} = require('./model.variables');
require('dotenv').config();

let modelId;
let categoryName;
let categoryId;

describe('Product queries', () => {
  beforeAll(async () => {
    const createCategory = await client.mutate({
      mutation: gql`
        mutation($category: CategoryInput!) {
          addCategory(category: $category) {
            ... on Category {
              _id
              name {
                value
              }
            }
          }
        }
      `,
      variables: { category: newCategory },
    });
    categoryName = createCategory.data.addCategory.name;
    categoryId = createCategory.data.addCategory._id;
  });
  test('Should create model', async () => {
    const createModel = await client.mutate({
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
                }
              }
            }
          }
        }
      `,
      variables: { model: { ...newModelMutation, category: categoryId } },
    });

    const model = createModel.data.addModel;
    modelId = model._id;

    expect(model).toBeDefined();
    expect(model).toHaveProperty('name', [
      { __typename: 'Language', value: 'Мутація', lang: 'uk' },
      { __typename: 'Language', value: 'Mutation', lang: 'en' },
    ]);
    expect(model).toHaveProperty('description', [
      { __typename: 'Language', value: 'Мутація', lang: 'uk' },
      { __typename: 'Language', value: 'Mutation', lang: 'en' },
    ]);
    expect(model).toHaveProperty('images', {
      __typename: 'ImageSet',
      large: 'large_new',
      medium: 'medium_new',
      small: 'small_new',
      thumbnail: 'thumbnail_new',
    });
    expect(model).toHaveProperty('category', {
      __typename: 'Category',
      name: categoryName,
    });
  });
  test('Should throw error MODEL_ALREADY_EXIST', async () => {
    const res = await client.mutate({
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
                }
              }
            }
            ... on Error {
              statusCode
              message
            }
          }
        }
      `,
      variables: { model: { ...newModelMutation, category: categoryId } },
    });

    const error = res.data.addModel;
    expect(error).toBeDefined();
    expect(error).toHaveProperty('statusCode', 400);
    expect(error).toHaveProperty('message', 'MODEL_ALREADY_EXIST');
  });
  test('Should throw error MODEL_NOT_FOUND', async () => {
    const res = await client.mutate({
      mutation: gql`
        mutation($id: ID!) {
          deleteModel(id: $id) {
            ... on Model {
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
                }
              }
            }
            ... on Error {
              statusCode
              message
            }
          }
        }
      `,
      variables: { id: wrongId },
    });

    const error = res.data.deleteModel;
    expect(error).toBeDefined();
    expect(error).toHaveProperty('statusCode', 404);
    expect(error).toHaveProperty('message', 'MODEL_NOT_FOUND');
  });
  test('Should update model', async () => {
    const updateModel = await client.mutate({
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
              images {
                large
                medium
                small
                thumbnail
              }
              category {
                name {
                  value
                }
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
        model: { ...newModelUpdated, category: categoryId },
        id: modelId,
      },
    });

    const modelUpdate = updateModel.data.updateModel;

    expect(modelUpdate).toBeDefined();
    expect(modelUpdate).toHaveProperty('name', [
      { __typename: 'Language', value: 'Обновлено', lang: 'uk' },
      { __typename: 'Language', value: 'Updated', lang: 'en' },
    ]);
    expect(modelUpdate).toHaveProperty('description', [
      { __typename: 'Language', value: 'Обновлено', lang: 'uk' },
      { __typename: 'Language', value: 'Updated', lang: 'en' },
    ]);
    expect(modelUpdate).toHaveProperty('images', {
      __typename: 'ImageSet',
      large: 'large_new',
      medium: 'medium_new',
      small: 'small_new',
      thumbnail: 'thumbnail_new',
    });
    expect(modelUpdate).toHaveProperty('category', {
      __typename: 'Category',
      name: categoryName,
    });
  });
  test('Should delete model', async () => {
    const deleteModel = await client.mutate({
      mutation: gql`
        mutation($id: ID!) {
          deleteModel(id: $id) {
            ... on Model {
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
                }
              }
            }
            ... on Error {
              statusCode
              message
            }
          }
        }
      `,
      variables: { id: modelId },
    });

    const modelDelete = deleteModel.data.deleteModel;

    expect(modelDelete).toBeDefined();
    expect(modelDelete).toHaveProperty('name', [
      { __typename: 'Language', value: 'Обновлено', lang: 'uk' },
      { __typename: 'Language', value: 'Updated', lang: 'en' },
    ]);
    expect(modelDelete).toHaveProperty('description', [
      { __typename: 'Language', value: 'Обновлено', lang: 'uk' },
      { __typename: 'Language', value: 'Updated', lang: 'en' },
    ]);
    expect(modelDelete).toHaveProperty('images', {
      __typename: 'ImageSet',
      large: 'large_new',
      medium: 'medium_new',
      small: 'small_new',
      thumbnail: 'thumbnail_new',
    });
    expect(modelDelete).toHaveProperty('category', {
      __typename: 'Category',
      name: categoryName,
    });
  });
  afterAll(async () => {
    await client.mutate({
      mutation: gql`
        mutation($id: ID!) {
          deleteCategory(id: $id) {
            ... on Category {
              _id
            }
            ... on Error {
              statusCode
              message
            }
          }
        }
      `,
      variables: { id: categoryId },
    });
  });
});
