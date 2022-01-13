const { gql } = require('@apollo/client');

const createPocket = async (pocket, images, operations) => {
  const pocketInfo = await operations.mutate({
    mutation: gql`
      mutation($pocket: PocketInput!, $images: Upload!) {
        addPocket(pocket: $pocket, images: $images) {
          ... on Pocket {
            _id
            name {
              lang
              value
            }
            images {
              small
              medium
              large
              thumbnail
            }

            restriction
            optionType
            translationsKey
          }
          ... on Error {
            message
            statusCode
          }
        }
      }
    `,
    variables: { pocket, images },
  });
  return pocketInfo.data.addPocket;
};

const updatePocket = async (id, pocket, image, operations) => {
  const pocketInfo = await operations.mutate({
    mutation: gql`
      mutation($id: ID!, $pocket: PocketInput!, $image: Upload) {
        updatePocket(id: $id, pocket: $pocket, image: $image) {
          ... on Pocket {
            _id
            name {
              lang
              value
            }
            images {
              small
              medium
              large
              thumbnail
            }

            restriction
            optionType
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
      pocket,
      image,
    },
  });

  return pocketInfo.data.updatePocket;
};

const getAllPockets = async ({ limit, skip, filter }, operations) => {
  const pocketInfo = await operations.query({
    query: gql`
      query($limit: Int!, $skip: Int!, $filter: PocketFilterInput) {
        getAllPockets(limit: $limit, skip: $skip, filter: $filter) {
          items {
            _id
            name {
              lang
              value
            }
            images {
              small
              medium
              large
              thumbnail
            }

            restriction
            optionType
            optionType
          }
        }
      }
    `,
    variables: { limit, skip, filter },
  });
  return pocketInfo.data.getAllPockets.items;
};

const getPocketById = async (id, operations) => {
  const pocketInfo = await operations.query({
    query: gql`
      query($id: ID!) {
        getPocketById(id: $id) {
          ... on Pocket {
            _id
            name {
              lang
              value
            }
            optionType
            images {
              large
              medium
              small
              thumbnail
            }
            additionalPrice {
              currency
              value
            }
            restriction
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
  return pocketInfo.data.getPocketById;
};

const deletePocket = async (id, operations) => {
  const pocketInfo = await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        deletePocket(id: $id) {
          ... on Pocket {
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
  return pocketInfo.data.deletePocket;
};

module.exports = {
  deletePocket,
  createPocket,
  getPocketById,
  updatePocket,
  getAllPockets,
};
