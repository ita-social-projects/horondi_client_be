/* eslint-disable no-undef */
const { gql } = require('@apollo/client');
const {
  newComment,
  updatedComment,
  productWrongId,
  commentWrongId,
  rate,
  updatedRate,
  createModel,
  newCategory,
  newModel,
  newMaterial,
  getNewProduct,
} = require('./comment.variables');
const {
  COMMENT_NOT_FOUND,
  COMMENT_FOR_NOT_EXISTING_PRODUCT,
  RATE_FOR_NOT_EXISTING_PRODUCT,
} = require('../../error-messages/comment.messages');
const { setupApp } = require('../helper-functions');
jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.model.js');
jest.mock('../../modules/product/product.service.js');

let commentId = '';
let operations;
let productRate;
let productRateCount;
let productUserRates;
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
      .query({
        variables: { id: productId },
        query: gql`
          query($id: ID!) {
            getProductById(id: $id) {
              ... on Product {
                rate
                userRates {
                  rate
                }
                rateCount
              }
              ... on Error {
                message
              }
            }
          }
        `,
      })
      .catch(e => e);
    const receivedProduct = res.data.getProductById;
    productRate = receivedProduct.rate;
    productRateCount = receivedProduct.rateCount;
    productUserRates = receivedProduct.userRates;
  });
  it(' should add a new comment', async () => {
    const res = await operations
      .mutate({
        mutation: gql`
          mutation($productId: ID!, $comment: commentInput!) {
            addComment(productId: $productId, comment: $comment) {
              ... on Comment {
                _id
                text
                show
                user {
                  email
                }
                product {
                  _id
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
          productId,
          comment: { ...newComment, product: productId },
        },
      })
      .catch(e => e);
    commentId = res.data.addComment._id;
    const receivedComment = res.data.addComment;

    expect(receivedComment).not.toBeNull();
    expect(receivedComment).toBeDefined();
    expect(receivedComment).toHaveProperty('text', newComment.text);
    expect(receivedComment).toHaveProperty('show', newComment.show);
    expect(receivedComment).toHaveProperty('user', newComment.user);
    expect(receivedComment).toHaveProperty('productId', newComment.productId);
  });
  it(' should return error if to add comment to not existing product', async () => {
    const res = await operations
      .mutate({
        mutation: gql`
          mutation($productId: ID!, $comment: commentInput!) {
            addComment(productId: $productId, comment: $comment) {
              ... on Comment {
                _id
                text
                show
                user {
                  email
                }
                product {
                  _id
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
          productId: productWrongId,
          comment: { product: productWrongId, ...newComment },
        },
      })
      .catch(e => e);
    const receivedComment = res.data.addComment;
    expect(receivedComment).not.toBeNull();
    expect(receivedComment).toBeDefined();

    expect(receivedComment).toHaveProperty(
      'message',
      COMMENT_FOR_NOT_EXISTING_PRODUCT
    );
    expect(receivedComment).toHaveProperty('statusCode', 404);
  });

  it('  should update comment', async () => {
    const res = await operations
      .mutate({
        mutation: gql`
          mutation($id: ID!, $comment: commentInput!) {
            updateComment(id: $id, comment: $comment) {
              ... on Comment {
                _id
                text
                show
                user {
                  email
                }
                product {
                  _id
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
          id: commentId,
          comment: { product: productId, ...updatedComment },
        },
      })
      .catch(e => e);
    const receivedComment = res.data.updateComment;

    expect(receivedComment).not.toBeNull();
    expect(receivedComment).toBeDefined();
    expect(receivedComment).toHaveProperty('text', updatedComment.text);
    expect(receivedComment).toHaveProperty('show', updatedComment.show);
    expect(receivedComment).toHaveProperty('user', updatedComment.user);
    expect(receivedComment).toHaveProperty(
      'productId',
      updatedComment.productId
    );
  });

  it(' should return error if id of comment to update is not correct', async () => {
    const res = await operations
      .mutate({
        mutation: gql`
          mutation($id: ID!, $comment: commentInput!) {
            updateComment(id: $id, comment: $comment) {
              ... on Comment {
                _id
                text
                show
                user {
                  email
                }
                product {
                  _id
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
          id: commentWrongId,
          comment: { product: productId, ...updatedComment },
        },
      })
      .catch(e => e);
    const receivedComment = res.data.updateComment;
    expect(receivedComment).not.toBeNull();
    expect(receivedComment).toBeDefined();
    expect(receivedComment).toHaveProperty('message', COMMENT_NOT_FOUND);
    expect(receivedComment).toHaveProperty('statusCode', 404);
  });
  it('should add rate to the product', async () => {
    const res = await operations
      .mutate({
        mutation: gql`
          mutation($product: ID!, $userRate: UserRateInput!) {
            addRate(product: $product, userRate: $userRate) {
              ... on Product {
                rate
                rateCount
                userRates {
                  rate
                }
              }

              ... on Error {
                message
                statusCode
              }
            }
          }
        `,
        variables: { product: productId, userRate: { rate } },
      })
      .catch(e => e);
    const receivedComment = res.data.addRate;
    expect(receivedComment).toMatchSnapshot();
    expect(receivedComment).not.toBeNull();
    expect(receivedComment).toBeDefined();
    expect(receivedComment).toHaveProperty('rate', rate);
    expect(receivedComment).toHaveProperty('rateCount', 1);
    expect(receivedComment.userRates.length).toEqual(1);
  });
  it('should update rate of the product', async () => {
    const res = await operations
      .mutate({
        mutation: gql`
          mutation($product: ID!, $userRate: UserRateInput!) {
            addRate(product: $product, userRate: $userRate) {
              ... on Product {
                rate
                rateCount
                userRates {
                  rate
                }
              }

              ... on Error {
                message
                statusCode
              }
            }
          }
        `,
        variables: { product: productId, userRate: { rate: updatedRate } },
      })
      .catch(e => e);
    const receivedComment = res.data.addRate;
    expect(receivedComment).toMatchSnapshot();
    expect(receivedComment).not.toBeNull();
    expect(receivedComment).toBeDefined();
    expect(receivedComment).toHaveProperty('rate', updatedRate);
    expect(receivedComment).toHaveProperty('rateCount', 1);
    expect(receivedComment.userRates.length).toEqual(1);
  });
  it('should return error if to add rate to not existing product', async () => {
    const res = await operations
      .mutate({
        mutation: gql`
          mutation($product: ID!, $userRate: UserRateInput!) {
            addRate(product: $product, userRate: $userRate) {
              ... on Product {
                rate
                rateCount
                userRates {
                  rate
                }
              }

              ... on Error {
                message
                statusCode
              }
            }
          }
        `,
        variables: { product: productWrongId, userRate: { rate } },
      })
      .catch(e => e);

    const receivedComment = res.data.addRate;
    expect(receivedComment).toMatchSnapshot();
    expect(receivedComment).not.toBeNull();
    expect(receivedComment).toBeDefined();
    expect(receivedComment).toHaveProperty(
      'message',
      RATE_FOR_NOT_EXISTING_PRODUCT
    );
    expect(receivedComment).toHaveProperty('statusCode', 404);
  });
  afterAll(async () => {
    await deleteAll(materialId, productId, categoryId, modelId);
  });
});
