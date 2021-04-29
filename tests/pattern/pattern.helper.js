const { gql } = require('@apollo/client');

const createPattern = async (pattern, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation($pattern: PatternInput!) {
        addPattern(pattern: $pattern, image: []) {
          ... on Pattern {
            _id
            name {
              lang
              value
            }
            description {
              lang
              value
            }
            optionType
            model {
              _id
            }
            features {
              material {
                _id
              }
              handmade
            }
            additionalPrice {
              currency
              value
            }
            available
            customizable
          }
          ... on Error {
            message
            statusCode
          }
        }
      }
    `,
    variables: { pattern },
  });
  return res.data.addPattern;
};
const deletePattern = async (id, operations) => {
  return await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        deletePattern(id: $id) {
          ... on Pattern {
            _id
            name {
              value
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
};
const getAllPatterns = async operations => {
  const res = await operations.query({
    query: gql`
      query {
        getAllPatterns {
          items {
            _id
            name {
              lang
              value
            }
            description {
              lang
              value
            }
            optionType
            model {
              _id
            }
            features {
              material {
                _id
              }
              handmade
            }
            additionalPrice {
              currency
              value
            }
            available
            customizable
          }
        }
      }
    `,
  });
  return res.data.getAllPatterns;
};
const getPatternById = async (id, operations) => {
  const res = await operations.query({
    query: gql`
      query($id: ID!) {
        getPatternById(id: $id) {
          ... on Pattern {
            _id
            name {
              lang
              value
            }
            description {
              lang
              value
            }
            optionType
            model {
              _id
            }
            features {
              material {
                _id
              }
              handmade
            }
            additionalPrice {
              currency
              value
            }
            available
            customizable
          }
          ... on Error {
            message
            statusCode
          }
        }
      }
    `,
    variables: { id },
  });
  return res.data.getPatternById;
};
const getAllPatternsPaginated = async (skip, limit, operations) => {
  return await operations.query({
    query: gql`
      query($skip: Int, $limit: Int) {
        getAllPatterns(skip: $skip, limit: $limit) {
          items {
            name {
              lang
              value
            }
            description {
              lang
              value
            }
            optionType
            model {
              _id
            }
            features {
              material {
                _id
              }
              handmade
            }
            additionalPrice {
              currency
              value
            }
            available
            customizable
          }
          count
        }
      }
    `,
    variables: { skip, limit },
  });
};
const updatePattern = async (id, pattern, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation($id: ID!, $pattern: PatternInput!) {
        updatePattern(id: $id, pattern: $pattern, image: []) {
          ... on Pattern {
            _id
            name {
              lang
              value
            }
            description {
              lang
              value
            }
            optionType
            model {
              _id
            }
            features {
              material {
                _id
              }
              handmade
            }
            additionalPrice {
              currency
              value
            }
            available
            default
          }
          ... on Error {
            message
            statusCode
          }
        }
      }
    `,
    variables: { id, pattern },
  });
  return res.data.updatePattern;
};

module.exports = {
  deletePattern,
  createPattern,
  getAllPatterns,
  getPatternById,
  getAllPatternsPaginated,
  updatePattern,
};
