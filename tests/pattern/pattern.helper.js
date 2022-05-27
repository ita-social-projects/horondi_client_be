const { gql } = require('@apollo/client');

const createPattern = async (pattern, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation ($pattern: PatternInput!) {
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
            absolutePrice
            relativePrice
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
  const deletedPattern = await operations.mutate({
    mutation: gql`
      mutation ($id: ID!) {
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

  return deletedPattern.data.deletePattern;
};
const getAllPatterns = async (limit, skip, filter, operations) => {
  const res = await operations.query({
    query: gql`
      query ($limit: Int!, $skip: Int!, $filter: PatternFilterInput!) {
        getAllPatterns(limit: $limit, skip: $skip, filter: $filter) {
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
            absolutePrice
            relativePrice
            available
            customizable
          }
        }
      }
    `,
    variables: { limit, skip, filter },
  });

  return res.data.getAllPatterns;
};
const getPatternById = async (id, operations) => {
  const res = await operations.query({
    query: gql`
      query ($id: ID!) {
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
            absolutePrice
            relativePrice
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
const getAllPatternsPaginated = async (limit, skip, filter, operations) => {
  const res = await operations.query({
    query: gql`
      query ($limit: Int!, $skip: Int!, $filter: PatternFilterInput!) {
        getAllPatterns(limit: $limit, skip: $skip, filter: $filter) {
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
            absolutePrice
            relativePrice
            available
            customizable
          }
          count
        }
      }
    `,
    variables: { limit, skip, filter },
  });

  return res.data.getAllPatterns;
};

const updatePattern = async (id, pattern, image, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation ($id: ID!, $pattern: PatternInput!, $image: Upload) {
        updatePattern(id: $id, pattern: $pattern, image: $image) {
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
            absolutePrice
            relativePrice
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
    variables: { id, pattern, image },
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
