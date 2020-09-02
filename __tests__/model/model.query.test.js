/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const client = require('../../utils/apollo-test-client');
const { newCategory, newModel } = require('./model.variables');
require('dotenv').config();

let modelId, categoryId, categoryName;

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
    categoryName = createCategory.data.addCategory.name;

    const createModel = await client.mutate({
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
        }`,
        variables: {
          category: categoryId
        }
    })

    const models = res.data.getModelsByCategory;

    expect(models).toBeDefined();
    expect(models.length).toBeGreaterThan(0);
    expect(models[0].name).toBeInstanceOf(Array);
    expect(models[0]).toHaveProperty('name', [
        { "__typename": "Language", value: "Тест", lang: "uk" },
        { "__typename": "Language", value: "Test", lang: "en" }
      ]);
    expect(models[0]).toHaveProperty('description', [
        { "__typename": "Language", value: "Тест", lang: "uk" },
        { "__typename": "Language", value: "Test", lang: "en" }
      ]);
    expect(models[0]).toHaveProperty('images', {
        "__typename": "ImageSet",
        "large": "large_new",
        "medium": "medium_new",
        "small": "small_new",
        "thumbnail": "thumbnail_new"
    });
    expect(models[0]).toHaveProperty('category', {
      "__typename": "Category", "name": [
            {
            "__typename": "Language",
            "value": "Нова",
           },
            {
             "__typename": "Language",
             "value": "New",
          },
      ]
    });
  });
  test('Should throw error CATEGORY_NOT_VALID', async () => {
    const res = await client.query({
      query: gql`
        query{
          getModelsByCategory(id: "$category"){
            category{
              name {
                value
              }
            },
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
        }`
    }).catch(err => err)

    const error = res;

    expect(error.graphQLErrors[0].message).toBe("CATEGORY_NOT_VALID");
  });
  test('Should throw error CATEGORY_NOT_FOUND', async () => {
    const res = await client.query({
      query: gql`
        query{
          getModelsByCategory(id: "56ade69dd46eafc5968e5390"){
            category{
              name {
                value
              }
            },
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
        }`
    }).catch(err => err)

    const error = res;

    expect(error.graphQLErrors[0].message).toBe("CATEGORY_NOT_FOUND");
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
