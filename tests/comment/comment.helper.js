const { gql } = require('@apollo/client');

const addComment = async (productId, comment, operations) => {
  const res = await operations.mutate({
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
      comment: { ...comment, product: productId },
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
const updateComment = async (id, productId, updatedComment, operations) => {
  const res = await operations.mutate({
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
      id,
      comment: { product: productId, ...updatedComment },
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
const getAllCommentsByUser = async (userEmail, operations) => {
  const res = await operations.query({
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
    variables: {
      userEmail,
    },
  });
  return res.data.getAllCommentsByUser;
};
const getAllCommentsByProduct = async (productId, operations) => {
  return await operations.query({
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
    variables: {
      productId,
    },
  });
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
