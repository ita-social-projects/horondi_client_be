/* eslint-disable no-undef */
const { gql } = require('@apollo/client');
jest.mock('../../modules/upload/upload.service');
const { adminLogin, setupApp } = require('../helper-functions');

const {
  newCategory,
  newModelMutation,
  newModelUpdated,
  wrongId,
} = require('./model.variables');

let modelId;
let categoryName;
let categoryId;
let uploadFile = null;
let operations;
jest.mock('../../modules/upload/__mocks__/upload.service.js');

describe('Product queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
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
    });

    const model = createModel.data.addModel;
    modelId = model._id;

    expect(model).toBeDefined();
    expect(model).toHaveProperty(
      'name',
      newModelMutation.name.map(item => ({
        ...item,
      }))
    );
    expect(model).toHaveProperty(
      'description',
      newModelMutation.description.map(item => ({
        ...item,
      }))
    );
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
    });

    const error = res.errors[0];
    expect(error).toBeDefined();
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
        id: modelId,
      },
    });

    const modelUpdate = updateModel.data.updateModel;

    expect(modelUpdate).toBeDefined();
    expect(modelUpdate).toHaveProperty(
      'name',
      newModelUpdated.name.map(item => ({
        ...item,
      }))
    );
    expect(modelUpdate).toHaveProperty(
      'description',
      newModelUpdated.description.map(item => ({
        ...item,
      }))
    );
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
    });

    const modelDelete = deleteModel.data.deleteModel;

    expect(modelDelete).toBeDefined();
    expect(modelDelete).toHaveProperty(
      'name',
      newModelUpdated.name.map(item => ({
        ...item,
      }))
    );
    expect(modelDelete).toHaveProperty(
      'description',
      newModelUpdated.description.map(item => ({
        ...item,
      }))
    );
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
          deleteCategory(deleteId: $id, switchId: $id) {
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
    });
  });
});
