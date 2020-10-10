/* eslint-disable no-undef */
const { gql } = require('@apollo/client');
const {
  newComment,
  updatedComment,
  productId,
  productWrongId,
  commentWrongId,
  rate,
} = require('./comment.variables');
const {
  COMMENT_NOT_FOUND,
  COMMENT_FOR_NOT_EXISTING_PRODUCT,
  RATE_FOR_NOT_EXISTING_PRODUCT,
} = require('../../error-messages/comment.messages');
const { setupApp } = require('../helper-functions');
jest.mock('../../modules/upload/upload.service');

let commentId = '';
let operations;

describe('Comment queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
    console.log(operations);
  });
  it('should add a new comment', async () => {
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
        variables: { productId, comment: newComment },
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
  it('should return error if to add comment to not existing product', async () => {
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
        variables: { productId: productWrongId, comment: newComment },
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

  it('should update comment', async () => {
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
        variables: { id: commentId, comment: updatedComment },
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
  it('should return error if id of comment to update is not correct', async () => {
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
        variables: { id: commentWrongId, comment: updatedComment },
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
    console.log(res);
    const receivedComment = res.data.addRate;
    expect(receivedComment).toMatchSnapshot();
    expect(receivedComment).not.toBeNull();
    expect(receivedComment).toBeDefined();
    expect(receivedComment).toHaveProperty('rate', 4.3);
    expect(receivedComment).toHaveProperty('rateCount', 41);
    expect(receivedComment.userRates.length).toEqual(receivedComment.rateCount);
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
    console.log(res);
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
});
