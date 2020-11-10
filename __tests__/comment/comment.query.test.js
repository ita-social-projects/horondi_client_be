/* eslint-disable no-undef */
const { gql } = require('@apollo/client');
const { COMMENT_NOT_FOUND } = require('../../error-messages/comment.messages');
const { setupApp } = require('../helper-functions');

const {
  newComment,
  commentWrongId,
  validEmail,
  invalidEmail,
  productWrongId,
} = require('./comment.variables');

const {
  createModel,
  newCategory,
  newModel,
  newMaterial,
  getNewProduct,
} = require('../product/product.variables');

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.model.js');
jest.mock('../../modules/product/product.utils.js');

let commentId = '';
let operations;
let product;
let productId;
let categoryId;
let subcategoryId;
let modelId;
let materialId;

describe('Comment queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
    const itemsId = await createModel(newMaterial, newCategory, newModel);
    categoryId = itemsId.categoryId;
    subcategoryId = itemsId.subcategoryId;
    modelId = itemsId.modelId;
    materialId = itemsId.materialId;

    product = getNewProduct(categoryId, subcategoryId, modelId, materialId);
    const createProduct = await operations.mutate({
      mutation: gql`
        mutation($product: ProductInput!) {
          addProduct(upload: [], product: $product) {
            ... on Product {
              _id
            }
            ... on Error {
              message
            }
          }
        }
      `,
      variables: {
        product,
      },
    });
    productId = createProduct.data.addProduct._id;
    const res = await operations
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
        variables: {
          productId,
          comment: { ...newComment, product: productId },
        },
      })
      .catch(e => e);
    commentId = res.data.addComment._id;
  });

  afterAll(async () => {
    await deleteAll(materialId, productId, categoryId, modelId);
    await operations
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

  it(' Should receive all comments writen by selected user', async () => {
    const res = await operations
      .query({
        variables: {
          userEmail: validEmail,
        },
        query: gql`
          query($userEmail: String!) {
            getAllCommentsByUser(userEmail: $userEmail) {
              ... on Comment {
                text

                product {
                  _id
                }
                show
                user {
                  email
                }
              }
            }
          }
        `,
      })
      .catch(e => e);

    expect(res.data.getAllCommentsByUser).toBeDefined();
    expect(res.data.getAllCommentsByUser).toContainEqual({
      product: { _id: productId },
      text: newComment.text,
      user: newComment.user,
      show: newComment.show,
    });
  });
  it(' Should receive all comments for one product', async () => {
    const res = await operations
      .query({
        variables: {
          productId,
        },
        query: gql`
          query($productId: ID!) {
            getAllCommentsByProduct(productId: $productId) {
              items {
                text
                product {
                  _id
                }
                show
                user {
                  email
                }
              }
            }
          }
        `,
      })
      .catch(e => e);
    const receivedComments = res.data.getAllCommentsByProduct.items;
    expect(receivedComments).toBeDefined();
    expect(receivedComments).toContainEqual({
      product: { _id: productId },
      text: newComment.text,
      user: newComment.user,
      show: newComment.show,
    });
  });
  it(' Should receive all comments for one product', async () => {
    const res = await operations
      .query({
        variables: {
          productId: productWrongId,
        },
        query: gql`
          query($productId: ID!) {
            getAllCommentsByProduct(productId: $productId) {
              items {
                text
                product {
                  _id
                }
                show
                user {
                  email
                }
              }
            }
          }
        `,
      })
      .catch(e => e);
    const error = res.errors[0].message;

    expect(error).toBeDefined();
    expect(error).toBe(COMMENT_NOT_FOUND);
  });

  it(' should return empty array of comments for unexisting email ', async () => {
    const res = await operations.query({
      variables: {
        userEmail: invalidEmail,
      },
      query: gql`
        query($userEmail: String!) {
          getAllCommentsByUser(userEmail: $userEmail) {
            ... on Comment {
              text

              product {
                _id
              }
              show
              user {
                email
              }
            }
          }
        }
      `,
    });
    expect(res.data.getAllCommentsByUser).toBeDefined();
    expect(res.data.getAllCommentsByUser.length).toBe(0);
    expect(res.data.getAllCommentsByUser).toBeInstanceOf(Array);
  });

  it(' should return one comment', async () => {
    const res = await operations
      .query({
        variables: {
          id: commentId,
        },
        query: gql`
          query($id: ID!) {
            getCommentById(id: $id) {
              ... on Comment {
                text
                product {
                  _id
                }
                show
                user {
                  email
                }
              }
              ... on Error {
                message
                statusCode
              }
            }
          }
        `,
      })
      .catch(e => e);
    const receivedComment = res.data.getCommentById;
    expect(receivedComment).toBeDefined();

    expect(receivedComment).toBeDefined();
    expect(receivedComment).toEqual({
      product: { _id: productId },
      text: newComment.text,
      user: newComment.user,
      show: newComment.show,
    });
  });
  it(' should return error when find comment by wrong id', async () => {
    const res = await operations
      .query({
        variables: {
          id: commentWrongId,
        },
        query: gql`
          query($id: ID!) {
            getCommentById(id: $id) {
              ... on Comment {
                text
                product {
                  _id
                }
                show
                user {
                  email
                }
              }
              ... on Error {
                message
                statusCode
              }
            }
          }
        `,
      })
      .catch(e => e);
    const receivedComment = res.data.getCommentById;
    expect(receivedComment).toBeDefined();
    expect(receivedComment).toMatchSnapshot();
    expect(receivedComment).toBeDefined();
    expect(receivedComment).toHaveProperty('statusCode', 404);
    expect(receivedComment).toHaveProperty('message', COMMENT_NOT_FOUND);
  });
});
