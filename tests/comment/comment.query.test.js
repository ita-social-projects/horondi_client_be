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
  newCategory,
  newConstructorBasic,
  newModel,
  newClosure,
  newPattern,
  newProduct,
  color,
  getMaterial,
} = require('./comment.variables');

const { deleteAll } = require('../product/product.variables');

const {
  deleteConstructorBasic,
  createConstructorBasic,
} = require('../constructor-basic/constructor-basic.helper');

const { createPattern, deletePattern } = require('../pattern/pattern.helper');
const { createModel } = require('../model/model.helper');
const { createCategory } = require('../category/category.helper');
const { createMaterial } = require('../materials/material.helper');
const { createProduct } = require('../product/product.helper');
const { createColor, deleteColor } = require('../color/color.helper');
const { createClosure, deleteClosure } = require('../closure/closure.helper');
jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.model.js');
jest.mock('../../modules/product/product.utils.js');

let commentId = '';
let operations;
let modelId;
let materialId;
let productId;
let categoryId;
let closureId;
let patternId;
let constructorBasicId;
let colorId;
let newMaterial;

describe('Comment queries', () => {
  beforeAll(async done => {
    operations = await setupApp();
    colorId = await createColor(color, operations);
    categoryId = await createCategory(newCategory, operations);
    newMaterial = getMaterial(colorId);
    materialId = await createMaterial(newMaterial, operations);
    patternId = await createPattern(newPattern, operations);
    closureId = await createClosure(newClosure(materialId), operations);
    constructorBasicId = await createConstructorBasic(
      newConstructorBasic(materialId, colorId),
      operations
    );
    modelId = await createModel(
      newModel(categoryId, constructorBasicId),
      operations
    );
    productId = await createProduct(
      newProduct(
        categoryId,
        modelId,
        materialId,
        materialId,
        colorId,
        patternId,
        closureId
      ),
      operations
    );

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
    done();
  });

  afterAll(async done => {
    await deleteAll(materialId, productId, categoryId, modelId);
    await deleteConstructorBasic(constructorBasicId, operations);
    await deleteColor(colorId, operations);
    await deleteClosure(closureId, operations);
    await deletePattern(patternId, operations);
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
    done();
  });

  it(' Should receive all comments writen by selected user', async done => {
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
    done();
  });
  it(' Should receive all comments for one product', async done => {
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
    done();
  });
  it(' Should receive all comments for one product', async done => {
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
    done();
  });

  it(' should return empty array of comments for unexisting email ', async done => {
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
    done();
  });

  it(' should return one comment', async done => {
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
    done();
  });
  it(' should return error when find comment by wrong id', async done => {
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
    done();
  });
});
