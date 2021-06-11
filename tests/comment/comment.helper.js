const { gql } = require('@apollo/client');

const addComment = async (productId, comment, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation($id: ID, $comment: CommentInput!) {
        addComment(id: $id, comment: $comment) {
          ... on Comment {
            _id
            text
            show
            user {
              _id
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
      comment: { ...comment, product: productId },
      id: comment.user,
    },
  });
  return res.data.addComment;
};
const addRate = async (productId, rate, operations) => {
  const res = await operations.mutate({
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
  });
  return res.data.addRate;
};
const updateComment = async (id, updatedComment, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation($id: ID!, $comment: CommentUpdateInput!) {
        updateComment(id: $id, comment: $comment) {
          ... on Comment {
            _id
            text
            show
            user {
              _id
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
      id,
      comment: { ...updatedComment },
    },
  });
  return res.data.updateComment;
};
const deleteComment = async (id, operations) => {
  await operations.mutate({
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
    variables: { id },
  });
};
const getAllCommentsByUser = async (userId, operations) => {
  const res = await operations.query({
    query: gql`
      query($userId: ID!) {
        getAllCommentsByUser(userId: $userId) {
          ... on Comment {
            text

            product {
              _id
            }
            show
            user {
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
      userId,
    },
  });
  return res.data.getAllCommentsByUser;
};
const getAllCommentsByProduct = async (productId, operations) => {
  const res = await operations.query({
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
    },
  });

  return res;
};
const getCommentById = async (id, operations) => {
  const res = await operations.query({
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
      id,
    },
  });

  return res.data.getCommentById;
};

module.exports = {
  addComment,
  deleteComment,
  getAllCommentsByUser,
  getAllCommentsByProduct,
  getCommentById,
  updateComment,
  addRate,
};
