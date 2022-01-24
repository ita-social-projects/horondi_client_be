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
            verifiedPurchase
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
const deleteComment = async (id, commentID, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation($id: ID, $commentID: ID!) {
        deleteComment(id: $id, commentID: $commentID) {
          ... on Comment {
            _id
            text
          }
          ... on Error {
            statusCode
            message
          }
        }
      }
    `,
    variables: { id, commentID },
  });

  return res.data.deleteComment;
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
const getCommentsByProduct = async (filter, pagination, operations) => {
  const res = await operations.query({
    query: gql`
      query($filter: ProductCommentFilterInput, $pagination: Pagination) {
        getCommentsByProduct(filter: $filter, pagination: $pagination) {
          ... on PaginatedComments {
            items {
              _id
              text
              show
              user {
                _id
              }
            }
            count
          }
          ... on Error {
            statusCode
            message
          }
        }
      }
    `,
    variables: {
      filter,
      pagination,
    },
  });

  return res.data.getCommentsByProduct;
};
const getReplyCommentsByProduct = async (filter, pagination, operations) => {
  const res = await operations.query({
    query: gql`
      query($filter: ReplyCommentFilterInput, $pagination: Pagination) {
        getReplyCommentsByComment(filter: $filter, pagination: $pagination) {
          ... on PaginatedComments {
            items {
              _id
              replyComments {
                _id
                replyText
                showReplyComment
                answerer {
                  _id
                }
              }
            }
            count
          }
          ... on Error {
            statusCode
            message
          }
        }
      }
    `,
    variables: {
      filter,
      pagination,
    },
  });

  return res.data.getReplyCommentsByComment;
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
const addReplyComment = async (productId, comment, operations, commentId) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation(
        $id: ID
        $commentId: ID!
        $replyCommentData: ReplyCommentInput!
      ) {
        replyForComment(
          id: $id
          commentId: $commentId
          replyCommentData: $replyCommentData
        ) {
          ... on Comment {
            _id
            replyComments {
              _id
              replyText
              refToReplyComment
              showReplyComment
              verifiedPurchase
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
      replyCommentData: { ...comment, productId },
      id: comment.answerer,
      commentId,
    },
  });

  return res.data.replyForComment;
};
const deleteReplyComment = async (id, replyCommentId, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation($id: ID, $replyCommentId: ID!) {
        deleteReplyForComment(id: $id, replyCommentId: $replyCommentId) {
          ... on Comment {
            _id
            replyComments {
              replyText
            }
          }
          ... on Error {
            statusCode
            message
          }
        }
      }
    `,
    variables: { id, replyCommentId },
  });

  return res.data.deleteReplyForComment;
};
const updateReplyComment = async (id, updatedReplyComment, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation(
        $replyCommentId: ID!
        $replyCommentData: ReplyCommentUpdateInput!
      ) {
        updateReplyForComment(
          replyCommentId: $replyCommentId
          replyCommentData: $replyCommentData
        ) {
          ... on Comment {
            _id
            replyComments {
              _id
              replyText
              showReplyComment
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
      replyCommentId: id,
      replyCommentData: { ...updatedReplyComment },
    },
  });

  return res.data.updateReplyForComment;
};
const getAllComments = async (filter, pagination, sort, operations) => {
  const res = await operations.query({
    query: gql`
      query(
        $filter: CommentFilterInput
        $pagination: Pagination
        $sort: CommentsSortInput
      ) {
        getAllComments(filter: $filter, pagination: $pagination, sort: $sort) {
          ... on PaginatedComments {
            count
            items {
              _id
              text
            }
          }
        }
      }
    `,
    variables: {
      filter,
      pagination,
      sort,
    },
  });

  return res.data.getAllComments;
};
const getCommentsByUser = async (
  filter,
  pagination,
  sort,
  userId,
  operations
) => {
  const res = await operations.query({
    query: gql`
      query(
        $filter: CommentFilterInput
        $pagination: Pagination
        $sort: CommentsSortInput
        $userId: ID!
      ) {
        getCommentsByUser(
          filter: $filter
          pagination: $pagination
          sort: $sort
          userId: $userId
        ) {
          items {
            _id
            text
            date
            replyCommentsCount
            product {
              _id
              name {
                value
              }
            }
            show
          }
          count
        }
      }
    `,
    variables: {
      filter,
      pagination,
      sort,
      userId,
    },
  });

  return res.data.getCommentsByUser;
};
const getCommentsRepliesByUser = async (
  filter,
  pagination,
  sort,
  userId,
  operations
) => {
  const res = await operations.query({
    query: gql`
      query(
        $filter: ReplyCommentFilterInput
        $pagination: Pagination
        $sort: ReplyCommentsSortInput
        $userId: ID!
      ) {
        getCommentsRepliesByUser(
          filter: $filter
          pagination: $pagination
          sort: $sort
          userId: $userId
        ) {
          items {
            _id
            replyText
            createdAt
            refToReplyComment
            verifiedPurchase
            showReplyComment
          }
          count
        }
      }
    `,
    variables: {
      filter,
      pagination,
      sort,
      userId,
    },
  });

  return res.data.getCommentsRepliesByUser;
};
const getRecentComments = async (limit, operations) => {
  const res = await operations.query({
    query: gql`
      query($limit: Int!) {
        getRecentComments(limit: $limit) {
          ... on Comment {
            _id
            text
          }
          ... on Error {
            statusCode
            message
          }
        }
      }
    `,
    variables: {
      limit,
    },
  });

  return res.data.getRecentComments;
};
const getReplyCommentById = async (id, operations) => {
  const res = await operations.query({
    query: gql`
      query($id: ID!) {
        getReplyCommentById(id: $id) {
          ... on Comment {
            _id
            replyComments {
              _id
              replyText
              showReplyComment
              createdAt
              verifiedPurchase
              refToReplyComment
              answerer {
                _id
              }
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

  return res.data.getReplyCommentById;
};
module.exports = {
  addComment,
  deleteComment,
  getAllCommentsByUser,
  getCommentsByProduct,
  getCommentById,
  updateComment,
  addRate,
  addReplyComment,
  deleteReplyComment,
  updateReplyComment,
  getAllComments,
  getCommentsByUser,
  getCommentsRepliesByUser,
  getRecentComments,
  getReplyCommentsByProduct,
  getReplyCommentById,
};
