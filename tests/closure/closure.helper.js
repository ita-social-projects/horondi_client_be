const { gql } = require('@apollo/client');

const createClosure = async (closure, operations) => {
  const createdClosure = await operations.mutate({
    mutation: gql`
      mutation($closure: ClosureInput!) {
        addClosure(closure: $closure) {
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
      closure,
    },
  });

  return createdClosure.data.addClosure._id;
};
const deleteClosure = async (id, operations) => {
  await operations.mutate({
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

module.exports = {
  deleteClosure,
  createClosure,
};
