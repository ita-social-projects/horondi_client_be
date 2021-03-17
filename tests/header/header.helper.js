const { gql } = require('@apollo/client');

const addHeader = async (header, operations) => {
  const result = await operations.mutate({
    mutation: gql`
      mutation($header: HeaderInput!) {
        addHeader(header: $header) {
          ... on Header {
            _id
            title {
              lang
              value
            }
            link
            priority
          }
          ... on Error {
            message
            statusCode
          }
        }
      }
    `,
    variables: { header },
  });
  return result.data.addHeader;
};

const getAllHeaders = async operations => {
  const result = await operations.query({
    query: gql`
      query {
        getAllHeaders {
          _id
          title {
            lang
            value
          }
          link
          priority
        }
      }
    `,
  });
  return result.data.getAllHeaders;
};

const getHeaderById = async (id, operations) => {
  const result = await operations.query({
    query: gql`
      query($id: ID!) {
        getHeaderById(id: $id) {
          ... on Header {
            _id
            title {
              lang
              value
            }
            link
            priority
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
  return result.data.getHeaderById;
};

const deleteHeader = async (id, operations) => {
  const result = await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        deleteHeader(id: $id) {
          ... on Header {
            _id
            title {
              lang
              value
            }
            link
            priority
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
  return result.data.deleteHeader;
};

const updateHeader = async (id, header, operations) => {
  const result = await operations.mutate({
    mutation: gql`
      mutation($id: ID!, $header: HeaderInput!) {
        updateHeader(id: $id, header: $header) {
          ... on Header {
            _id
            title {
              lang
              value
            }
            link
            priority
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
      header,
    },
  });
  return result.data.updateHeader;
};

module.exports = {
  addHeader,
  getAllHeaders,
  getHeaderById,
  deleteHeader,
  updateHeader,
};
