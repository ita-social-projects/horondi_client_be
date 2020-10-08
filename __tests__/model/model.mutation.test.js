/* eslint-disable no-undef */
require('dotenv').config();
const fs = require('fs');
const { gql } = require('@apollo/client');
const client = require('../../utils/apollo-test-client');
const util = require('util');
jest.mock('../../modules/upload/upload.service');
const { adminLogin, setupApp } = require('../helper-functions');

const {
  newCategory,
  newModelMutation,
  newModelUpdated,
  wrongId,
  user,
} = require('./model.variables');

let modelId;
let categoryName;
let categoryId;
let uploadFile = null;
let token;

describe('Product queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
    token = await adminLogin(user);
    const createCategory = await operations.mutate({
      mutation: gql`
        mutation($category: CategoryInput!, $upload: Upload) {
          addCategory(category: $category, upload: $upload) {
            ... on Category {
              _id
              available
              name {
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
      variables: { category: newCategory, upload: '__tests__/model/img.png' },
      context: { headers: { token } },
    });
    categoryName = createCategory.data.addCategory.name;
    categoryId = createCategory.data.addCategory._id;
  });

  test('Should create model', async () => {
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
          }
        }
      `,
      variables: { model: { ...newModelMutation, category: categoryId } },
      context: { headers: { token } },
    });

    const model = createModel.data.addModel;
    modelId = model._id;

    expect(model).toBeDefined();
    expect(model).toHaveProperty('name', [
      { value: 'Мутація', lang: 'uk' },
      { value: 'Mutation', lang: 'en' },
    ]);
    expect(model).toHaveProperty('description', [
      { value: 'Мутація', lang: 'uk' },
      { value: 'Mutation', lang: 'en' },
    ]);
    expect(model).toHaveProperty('images', {
      large: 'large_new',
      medium: 'medium_new',
      small: 'small_new',
      thumbnail: 'thumbnail_new',
    });
    expect(model).toHaveProperty('category', {
      name: categoryName,
    });
  });

  test('Should throw error MODEL_ALREADY_EXIST', async () => {
    const res = await operations.mutate({
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
              statusCode
              message
            }
          }
        }
      `,
      variables: { model: { ...newModelMutation, category: categoryId } },
      context: { headers: { token } },
    });

    const error = res.data.addModel;
    expect(error).toBeDefined();
    expect(error).toHaveProperty('statusCode', 400);
    expect(error).toHaveProperty('message', 'MODEL_ALREADY_EXIST');
  });
  test('Should throw error MODEL_NOT_FOUND', async () => {
    const res = await operations.mutate({
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
                  lang
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
      context: { headers: { token } },
    });

    const error = res.data.deleteModel;
    expect(error).toBeDefined();
    expect(error).toHaveProperty('statusCode', 404);
    expect(error).toHaveProperty('message', 'MODEL_NOT_FOUND');
  });
  test('Should update model', async () => {
    const updateModel = await operations.mutate({
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
                  lang
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
        context: { headers: { token } },
        id: modelId,
      },
    });

    const modelUpdate = updateModel.data.updateModel;

    expect(modelUpdate).toBeDefined();
    expect(modelUpdate).toHaveProperty('name', [
      { value: 'Обновлено', lang: 'uk' },
      { value: 'Updated', lang: 'en' },
    ]);
    expect(modelUpdate).toHaveProperty('description', [
      { value: 'Обновлено', lang: 'uk' },
      { value: 'Updated', lang: 'en' },
    ]);
    expect(modelUpdate).toHaveProperty('images', {
      large: 'large_new',
      medium: 'medium_new',
      small: 'small_new',
      thumbnail: 'thumbnail_new',
    });
    expect(modelUpdate).toHaveProperty('category', {
      name: categoryName,
    });
  });
  test('Should delete model', async () => {
    const deleteModel = await operations.mutate({
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
                  lang
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
      context: { headers: { token } },
    });

    const modelDelete = deleteModel.data.deleteModel;

    expect(modelDelete).toBeDefined();
    expect(modelDelete).toHaveProperty('name', [
      { value: 'Обновлено', lang: 'uk' },
      { value: 'Updated', lang: 'en' },
    ]);
    expect(modelDelete).toHaveProperty('description', [
      { value: 'Обновлено', lang: 'uk' },
      { value: 'Updated', lang: 'en' },
    ]);
    expect(modelDelete).toHaveProperty('images', {
      large: 'large_new',
      medium: 'medium_new',
      small: 'small_new',
      thumbnail: 'thumbnail_new',
    });
    expect(modelDelete).toHaveProperty('category', {
      name: categoryName,
    });
  });

  afterAll(async () => {
    await operations.mutate({
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
      context: { headers: { token } },
    });

    await operations.mutate({
      mutation: gql`
        mutation($id: ID!) {
          deleteModel(id: $id) {
            ... on Model {
              _id
            }
            ... on Error {
              statusCode
              message
            }
          }
        }
      `,
      variables: { id: modelId },
      context: { headers: { token } },
    });
  });
});
