/* eslint-disable no-undef */
const { gql } = require('@apollo/client');
const {
  newComment,
  productId,
  commentToUpdate,
  commentDoesNotExistId,
  mutationCommentToAdd,
} = require('./comment.variables');
const {
  COMMENT_ALREADY_EXIST,
  COMMENT_NOT_FOUND,
} = require('../../error-messages/comment.messages');
const { setupApp } = require('../helper-functions');
jest.mock('../../modules/upload/upload.service');

let commentId = '';
let operations;

describe('Comment queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
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
        variables: { productId: productId, comment: newComment },
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
});
