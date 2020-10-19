/* eslint-disable no-undef */
const { gql } = require('@apollo/client');
const client = require('../../utils/apollo-test-client');
jest.mock('../../modules/upload/upload.service');
const { newCategory, newModel } = require('./model.variables');
const { setupApp } = require('../helper-functions');

let modelId;
let categoryId;
let operations;

describe('Product queries', () => {
  beforeAll(async () => {
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
          addModel(model: $model) {
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
  });
  test('Should receive all models by category id', async () => {
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
      large: 'large_new',
      medium: 'medium_new',
      small: 'small_new',
      thumbnail: 'thumbnail_new',
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
  });
  test('Should throw error CATEGORY_NOT_VALID', async () => {
    const res = await client
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

    expect(error.graphQLErrors[0].message).toBe('CATEGORY_NOT_VALID');
  });
  test('Should throw error CATEGORY_NOT_FOUND', async () => {
    const res = await client
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
    const error = res;
    expect(error.graphQLErrors[0].message).toBe('CATEGORY_NOT_FOUND');
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
