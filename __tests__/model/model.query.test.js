/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const client = require('../../utils/apollo-test-client');
const { newCategory, newModel } = require('./model.variables');
require('dotenv').config();

let modelId, categoryId;

describe('Product queries', () => {
  beforeAll(async () => {
    const createCategory = await client.mutate({
      mutation: gql`
        mutation($category: CategoryInput!) {
          addCategory(category: $category) {
            ... on Category {
              _id
            }
          }
        }
      `,
      variables: { category: newCategory },
    });
    categoryId = createCategory.data.addCategory._id;

    const createModel = await client.mutate({
      mutation: gql`
        mutation($model: ModelInput!) {
          addModel(model: $model) {
            ... on Model {
              _id
            }
          }
        }
      `,
      variables: { model: { ...newModel, category: categoryId } },
    });
    modelId = createModel.data.addModel._id;
  });
  test('Should receive all models by category id', async () => {
    const res = await client.query({
      query: gql`
        query(
          $category: ID!
        ){
          getModelsByCategory(id: $category){
            category{
              name {
                value
              }
            },
            name {
              value
            }
            images {
              large
            }
          }
        }`,
        variables: {
          category: categoryId
        }
      ,
    }).catch(er => er );

    const models = res.data.getModelsByCategory;
    
    expect(models).toBeDefined();
    expect(models.length).toBeGreaterThan(0);
    expect(models[0].name).toBeInstanceOf(Array);
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

    await client.mutate({
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
