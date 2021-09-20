const { gql } = require('@apollo/client');

const createConstructor = async (constructor, image, operations) => {
  const result = await operations.mutate({
    mutation: gql`
      mutation($constructor: ConstructorInput!, $image: Upload) {
        addConstructor(constructor: $constructor, image: $image) {
          ... on Constructor {
            _id
            name {
              lang
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
    variables: { constructor, image },
  });

  return result.data.addConstructor;
};

const updateConstructor = async (id, constructor, image, operations) => {
  const result = await operations.mutate({
    mutation: gql`
      mutation($id: ID!, $constructor: ConstructorInput!, $image: Upload) {
        updateConstructor(id: $id, constructor: $constructor, image: $image) {
          ... on Constructor {
            _id
            name {
              lang
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
      constructor,
      image,
    },
  });

  return result.data.updateConstructor;
};

const getAllConstructors = async ({ limit, skip, filter }, operations) => {
  const result = await operations.query({
    query: gql`
      query($limit: Int!, $skip: Int!, $filter: ConstructorFilterInput) {
        getAllConstructors(limit: $limit, skip: $skip, filter: $filter) {
          items {
            _id
            name {
              lang
              value
            }
          }
        }
      }
    `,
    variables: { limit, skip, filter },
  });

  return result.data.getAllConstructors.items;
};

const getConstructorById = async (id, operations) => {
  const result = await operations.query({
    query: gql`
      query($id: ID!) {
        getConstructorById(id: $id) {
          ... on Constructor {
            _id
            name {
              lang
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
    variables: { id },
  });

  return result.data.getConstructorById;
};

const getConstructorByModel = async (id, operations) => {
  const result = await operations.query({
    query: gql`
      query($id: ID!) {
        getConstructorByModel(id: $id) {
          ... on Constructor {
            _id
            name {
              lang
              value
            }
            model {
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
    variables: { id },
  });

  return result.data.getConstructorByModel;
};

const deleteConstructor = async (id, operations) => {
  const result = await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        deleteConstructor(id: $id) {
          ... on Constructor {
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
  return result.data.deleteConstructor;
};

module.exports = {
  deleteConstructor,
  createConstructor,
  getConstructorById,
  updateConstructor,
  getAllConstructors,
  getConstructorByModel,
};
