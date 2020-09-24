/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const client = require('../../utils/apollo-test-client');
require('dotenv').config();
const { COMMENT_NOT_FOUND } = require('../../error-messages/comment.messages');

const {
  newComment,
  validEmail,
  invalidEmail,
  productId,
  wrongData,
} = require('./comment.variables');

let commentId = '';

describe('Comment queries', () => {
  beforeAll(async () => {
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

  afterAll(async () => {
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

  test('#3 Passing not email string should return error message', async () => {
    try {
      const res = await client.query({
        variables: {
          userEmail: wrongData,
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
});
