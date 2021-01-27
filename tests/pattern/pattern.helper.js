const { gql } = require('@apollo/client');

const createPattern = async (pattern, operations) => {
  const createdPattern = await operations.mutate({
    mutation: gql`
      mutation($pattern: PatternInput!) {
        addPattern(pattern: $pattern, image: []) {
          ... on Pattern {
            _id
          }
          ... on Error {
            message
          }
        }
      }
    `,
    variables: {
      pattern,
    },
  });

  return createdPattern.data.addPattern._id;
};
const deletePattern = async (id, operations) => {
  await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        deletePattern(id: $id) {
          ... on Pattern {
            _id
          }
          ... on Error {
            message
          }
        }
      }
    `,
    variables: {
      id,
    },
  });
};

module.exports = {
  deletePattern,
  createPattern,
};
