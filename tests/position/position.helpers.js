const { gql } = require('@apollo/client');

const createPosition = async (position, operations) => {
  const positionInfo = await operations.mutate({
    mutation: gql`
      mutation($position: PositionInput!) {
        addPosition(position: $position) {
          ... on Position {
            name {
              lang
              value
            }
            available
            _id
            translationsKey
          }
          ... on Error {
            message
            statusCode
          }
        }
      }
    `,
    variables: { position },
  });

  return positionInfo.data.addPosition;
};

const updatePosition = async (id, position, operations) => {
  const positionInfo = await operations.mutate({
    mutation: gql`
      mutation($id: ID!, $position: PositionInput!) {
        updatePosition(id: $id, position: $position) {
          ... on Position {
            _id
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
      position,
    },
  });

  return positionInfo.data.updatePosition;
};

const deletePosition = async (id, operations) => {
  const positionInfo = await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        deletePosition(id: $id) {
          ... on Position {
            _id
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

  return positionInfo.data.deletePosition;
};

const getAllPositions = async ({ limit, skip, filter }, operations) => {
  const positionInfo = await operations.query({
    query: gql`
      query($limit: Int, $skip: Int, $filter: PositionsFilterInput) {
        getAllPositions(limit: $limit, skip: $skip, filter: $filter) {
          ... on PaginatedPositions {
            items {
              _id
              name {
                lang
                value
              }
              available
            }
            count
          }
        }
      }
    `,
    variables: { limit, skip, filter },
  });

  return positionInfo.data.getAllPositions.items;
};

const getPositionById = async (id, operations) => {
  const positionInfo = await operations.query({
    query: gql`
      query($id: ID!) {
        getPositionById(id: $id) {
          ... on Position {
            _id
            name {
              lang
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
    variables: { id },
  });

  return positionInfo.data.getPositionById;
};

module.exports = {
  createPosition,
  updatePosition,
  deletePosition,
  getAllPositions,
  getPositionById,
};
