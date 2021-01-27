/* eslint-disable no-undef */
const { gql } = require('@apollo/client');
jest.mock('../../modules/upload/upload.service');
const { newCategory, newModel } = require('./model.variables');
const { setupApp } = require('../helper-functions');

let modelId;
let categoryId;
let operations;

describe('Model queries', () => {
  beforeAll(async done => {
    operations = await setupApp();
    const createCategory = await operations.mutate({
      mutation: gql`
        mutation($category: CategoryInput!, $upload: Upload) {
          addCategory(category: $category, upload: $upload) {
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
      variables: { category: newCategory, upload: '__tests__/model/img.png' },
    });
    categoryId = createCategory.data.addCategory._id;

    const createModel = await operations.mutate({
      mutation: gql`
        mutation($model: ModelInput!) {
          addModel(model: $model, upload: []) {
            ... on Model {
              _id
              name {
                value
              }
            }
          }
        }
      `,
      variables: { model: { ...newModel, category: categoryId } },
    });
    modelId = createModel.data.addModel._id;
    done();
  });
  test('Should receive all models by category id', async done => {
    const res = await operations.query({
      query: gql`
        query($category: ID!) {
          getModelsByCategory(id: $category) {
            category {
              name {
                value
              }
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
        category: categoryId,
      },
    });

    const models = res.data.getModelsByCategory;

    expect(models).toBeDefined();
    expect(models.length).toBeGreaterThan(0);
    expect(models[0].name).toBeInstanceOf(Array);
    expect(models[0]).toHaveProperty('name', [
      { value: 'Тест', lang: 'uk' },
      { value: 'Test', lang: 'en' },
    ]);
    expect(models[0]).toHaveProperty('description', [
      { value: 'Тест', lang: 'uk' },
      { value: 'Test', lang: 'en' },
    ]);
    expect(models[0]).toHaveProperty('images', {
      large: 'large_test-file',
      medium: 'medium_test-file',
      small: 'small_test-file',
      thumbnail: 'thumbnail_test-file',
    });
    expect(models[0]).toHaveProperty('category', {
      name: [
        {
          value: 'Нова',
        },
        {
          value: 'New',
        },
      ],
    });
    done();
  });
  test('Should throw error CATEGORY_NOT_VALID', async done => {
    const res = await operations
      .query({
        query: gql`
          query {
            getModelsByCategory(id: "$category") {
              category {
                name {
                  value
                }
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
              }
            }
          }
        `,
      })
      .catch(err => err);
    const error = res;
    expect(error.errors[0].message).toBe('CATEGORY_NOT_VALID');
    done();
  });
  test('Should return empty array when category isnt exist', async done => {
    const res = await operations
      .query({
        query: gql`
          query {
            getModelsByCategory(id: "56ade69dd46eafc5968e5390") {
              category {
                name {
                  value
                }
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
              }
            }
          }
        `,
      })
      .catch(err => err);
    const getModelsByCategory = res.data.getModelsByCategory;
    expect(getModelsByCategory.length).toBe(0);
    expect(getModelsByCategory).toBeInstanceOf(Array);
    done();
  });
  afterAll(async done => {
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
    done();
  });
});
