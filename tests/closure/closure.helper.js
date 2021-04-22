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
            optionType
            model {
              _id
            }
            features {
              material {
                _id
              }
              color {
                _id
              }
            }
            available
            default
            additionalPrice {
              currency
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
      closure,
    },
  });
  return createdClosure.data.addClosure;
};
const updateClosure = async (id, closure, operations) => {
  const updatedClosure = await operations.mutate({
    mutation: gql`
      mutation($id: ID!, $closure: ClosureInput!) {
        updateClosure(id: $id, closure: $closure) {
          ... on Closure {
            _id
            name {
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
              color {
                _id
              }
            }
            available
            default
            additionalPrice {
              currency
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
      closure,
      id,
    },
  });
  console.log('updatedClosure', updatedClosure.data);
  return updatedClosure.data.updateClosure;
};
const deleteClosure = async (id, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        deleteClosure(id: $id) {
          ... on Closure {
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
  return res.data.deleteClosure;
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
            optionType
            model {
              _id
            }
            features {
              material {
                _id
              }
              color {
                _id
              }
            }
            available
            default
            additionalPrice {
              currency
              value
            }
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

  return result.data.getClosureById;
};

module.exports = {
  deleteClosure,
  createClosure,
  getClosureById,
  updateClosure,
};
