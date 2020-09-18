/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const client = require('../../utils/apollo-test-client');
require('dotenv').config();
const { COMMENT_NOT_FOUND } = require('../../error-messages/comment.messages');

const { newComment, validEmail, invalidEmail } = require('./comment.variables');

const {
  newModel,
  newCategory,
  newMaterial,
  getNewProduct,
} = require('../product/product.variables');

let commentId = '';
let productId = '';
let categoryId;
let subcategoryId;
let modelId;
let materialId;

describe('Comment queries', () => {
  beforeAll(async () => {
    const createMaterial = await client.mutate({
      mutation: gql`
        mutation($material: MaterialInput!) {
          addMaterial(material: $material) {
            ... on Material {
              _id
              name {
                value
              }
            }
          }
        }
      `,
      variables: { material: newMaterial },
    });
    materialId = createMaterial.data.addMaterial._id;

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
    categoryId = createCategory.data.addCategory._id;
    subcategoryId = createCategory.data.addCategory._id;

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
    const createProduct = await client.mutate({
      mutation: gql`
        mutation($product: ProductInput!) {
          addProduct(product: $product) {
            ... on Product {
              _id
            }
          }
        }
      `,
      variables: {
        product: getNewProduct(categoryId, subcategoryId, modelId, materialId),
      },
    });
    productId = createProduct.data.addProduct._id;

    const res = await client
      .mutate({
        mutation: gql`
          mutation($productId: ID!, $comment: commentInput!) {
            addComment(productId: $productId, comment: $comment) {
              ... on Comment {
                _id
              }
              ... on Error {
                message
                statusCode
              }
            }
          }
        `,
        variables: { productId: productId, comment: newComment },
      })
      .catch(e => e);
    commentId = res.data.addComment._id;
  });

  test('#1 Should receive all comments writen by selected user', async () => {
    try {
      const res = await client.query({
        variables: {
          userEmail: validEmail,
        },
        query: gql`
          query($userEmail: String) {
            getAllCommentsByUser(userEmail: $userEmail) {
              ... on Comment {
                text
                date
                product {
                  _id
                }
                show
              }
              ... on Error {
                statusCode
                message
              }
            }
          }
        `,
      });

      expect(res.data.getAllCommentsByUser).toBeDefined();
      expect(res.data.getAllCommentsByUser).toContainEqual({
        __typename: 'Comment',
        text: newComment.text,
        user: newComment.user,
        product: productId,
        show: true,
      });
    } catch (e) {
      console.error(e);
    }
  });

  test('#2 Passing unexisting email should return error message', async () => {
    try {
      const res = await client.query({
        variables: {
          userEmail: invalidEmail,
        },
        query: gql`
          query($userEmail: String) {
            getAllCommentsByUser(userEmail: $userEmail) {
              ... on Comment {
                text
                date
                product {
                  _id
                }
                show
              }
              ... on Error {
                statusCode
                message
              }
            }
          }
        `,
      });

      expect(res.data.getAllCommentsByUser).toBeDefined();
      expect(res.data.getAllCommentsByUser).toHaveProperty('statusCode', 404);
      expect(res.data.getAllCommentsByUser).toHaveProperty(
        'message',
        COMMENT_NOT_FOUND
      );
    } catch (e) {
      console.error(e);
    }
  });

  afterAll(async () => {
    await client.mutate({
      mutation: gql`
        mutation($id: ID!) {
          deleteProduct(id: $id) {
            ... on Product {
              _id
            }
            ... on Error {
              statusCode
              message
            }
          }
        }
      `,
      variables: { id: productId },
    });

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

    await client.mutate({
      mutation: gql`
        mutation($id: ID!) {
          deleteMaterial(id: $id) {
            ... on Material {
              _id
            }
            ... on Error {
              statusCode
              message
            }
          }
        }
      `,
      variables: { id: materialId },
    });

    await client
      .mutate({
        mutation: gql`
          mutation($id: ID!) {
            deleteComment(id: $id) {
              ... on Comment {
                _id
              }
              ... on Error {
                statusCode
                message
              }
            }
          }
        `,
        variables: { id: commentId },
      })
      .catch(e => e);
  });
});
