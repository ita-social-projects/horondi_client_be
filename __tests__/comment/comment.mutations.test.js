/* eslint-disable no-undef */
const { gql } = require('@apollo/client');
const {
  newComment,
  updatedComment,
  productId,
  commentToUpdate,
  mutationCommentToAdd,
  productWrongId,
  commentWrongId,
} = require('./comment.variables');
const {
  COMMENT_NOT_FOUND,
  COMMENT_FOR_NOT_EXISTING_PRODUCT,
} = require('../../error-messages/comment.messages');

const { setupApp } = require('../helper-functions');
jest.mock('../../modules/upload/upload.service');

let commentId = '';
let operations;

describe('Comment queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });
  it('1 should add a new comment', async () => {
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
  it('2 should return error if to add comment to not existing product', async () => {
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

  it(' 3 should update comment', async () => {
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

  it('4 should return error if id of comment to update is not correct', async () => {
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

  it('5 should  delete comment', async () => {
    const res = await operations
      .mutate({
        mutation: gql`
          mutation($id: ID!) {
            deleteComment(id: $id) {
              ... on Comment {
                _id
                text
                user {
                  email
                }
                product {
                  _id
                }
                show
              }
              ... on Error {
                message
                statusCode
              }
            }
          }
        `,
        variables: { id: commentId },
      })
      .catch(e => e);
    const receivedComment = res.data.deleteComment;
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

  it('6 should  return error when delete not existed comment', async () => {
    const res = await operations
      .mutate({
        mutation: gql`
          mutation($id: ID!) {
            deleteComment(id: $id) {
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
        variables: { id: commentWrongId },
      })
      .catch(e => e);
    const receivedComment = res.data.deleteComment;
    expect(receivedComment).not.toBeNull();
    expect(receivedComment).toBeDefined();
    expect(receivedComment).toHaveProperty('message', COMMENT_NOT_FOUND);
    expect(receivedComment).toHaveProperty('statusCode', 404);
  });
});
