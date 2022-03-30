const { gql } = require('@apollo/client');

const addRestriction = async (restrictionData, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation ($restriction: RestrictionInput!) {
        addRestriction(restriction: $restriction) {
          ... on Restriction {
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
      restriction: restrictionData,
    },
  });

  return res.data.addRestriction;
};

const updateRestriction = async (id, updateData, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation ($id: ID!, $restriction: RestrictionInput!) {
        updateRestriction(id: $id, restriction: $restriction) {
          ... on Restriction {
            _id
            compareByExpression
            options {
              option
              feature
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
      restriction: updateData,
    },
  });

  return res.data.updateRestriction;
};

const deleteRestriction = async (id, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation ($id: ID!) {
        deleteRestriction(id: $id) {
          ... on Restriction {
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
      id,
    },
  });

  return res.data.deleteRestriction;
};

const getAllRestrictions = async (limit, skip, filter, operations) => {
  const res = await operations.query({
    query: gql`
      query ($limit: Int!, $skip: Int!, $filter: RestrictionFilterInput) {
        getAllRestrictions(limit: $limit, skip: $skip, filter: $filter) {
          items {
            _id
            compareByExpression
            options {
              option
              feature
            }
          }
          count
        }
      }
    `,
    variables: {
      limit,
      skip,
      filter,
    },
  });

  return res.data.getAllRestrictions;
};

const getRestrictionById = async (id, operations) => {
  const res = await operations.query({
    query: gql`
      query ($id: ID!) {
        getRestrictionById(id: $id) {
          ... on Restriction {
            _id
            compareByExpression
            options {
              option
              feature
            }
          }
        }
      }
    `,
    variables: {
      id,
    },
  });

  return res.data.getRestrictionById;
};

module.exports = {
  addRestriction,
  getAllRestrictions,
  deleteRestriction,
  getRestrictionById,
  updateRestriction,
};
