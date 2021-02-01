const { gql } = require('@apollo/client');

const createClosure = async (closure, operations) => {
  const createdClosure = await operations.mutate({
    mutation: gql`
      mutation($closure: ClosureInput!) {
        addClosure(closure: $closure) {
          ... on Closure {
            _id
            name {
              lang
              value
            }
            additionalPrice {
              currency
              value
            }
            available
          }
          ... on Error {
            message
            statusCode
          }
        }
      }
    `,
    variables: {
      closure,
    },
  });

  return createdClosure.data.addClosure;
};
const deleteClosure = async (id, operations) => {
  return await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        deleteClosure(id: $id) {
          ... on Closure {
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
const getClosureById = async (id, operations) => {
  const result = await operations.query({
    query: gql`
      query($id: ID!) {
        getClosureById(id: $id) {
          ... on Closure {
            _id
            name {
              lang
              value
            }
            additionalPrice {
              currency
              value
            }
            available
          }
          ... on Error {
            statusCode
            message
          }
        }
      }
    `,
    variables: {
      id,
    },
  });

  return result.data.getSizeById;
};

module.exports = {
  deleteClosure,
  createClosure,
};
