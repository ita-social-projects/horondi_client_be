/* eslint-disable no-undef */
const { gql } = require('@apollo/client');
const { USER_NOT_FOUND } = require('../../error-messages/user.messages');
const { COMMENT_NOT_FOUND } = require('../../error-messages/comment.messages');
const { setupApp } = require('../helper-functions');

const {
  newComment,
  commentWrongId,
  validEmail,
  invalidEmail,
  productId,
  productWrongId,
  wrongData,
} = require('./comment.variables');

let commentId = '';
let operations;
describe('Comment queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
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
        variables: { productId: productId, comment: newComment },
      })
      .catch(e => e);
    commentId = res.data.addComment._id;
  });

  afterAll(async () => {
    const res = await operations
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
              ... on Error {
                message
                statusCode
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
    const receivedComments = res.data.getAllCommentsByProduct;

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
    const receivedComments = res.data.getAllCommentsByProduct;

    expect(receivedComments).toMatchSnapshot();
    expect(receivedComments).toBeDefined();
    expect(receivedComments[0]).toHaveProperty('statusCode', 404);
    expect(receivedComments[0]).toHaveProperty('message', COMMENT_NOT_FOUND);
  });

  it(' should return error messagePassing unexisting email ', async () => {
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
            ... on Error {
              message
              statusCode
            }
          }
        }
      `,
    });

    expect(res.data.getAllCommentsByUser).toBeDefined();
    expect(res.data.getAllCommentsByUser[0]).toHaveProperty('statusCode', 404);
    expect(res.data.getAllCommentsByUser[0]).toHaveProperty(
      'message',
      USER_NOT_FOUND
    );
  });

  it('should return error message Passing not email string ', async () => {
    const res = await operations.query({
      variables: {
        userEmail: wrongData,
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
            ... on Error {
              message
              statusCode
            }
          }
        }
      `,
    });

    expect(res.data.getAllCommentsByUser).toBeDefined();
    expect(res.data.getAllCommentsByUser[0]).toHaveProperty('statusCode', 404);
    expect(res.data.getAllCommentsByUser[0]).toHaveProperty(
      'message',
      USER_NOT_FOUND
    );
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
