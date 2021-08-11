const { gql } = require('@apollo/client');

const createBasics = async (basic, image, operations) => {
  const basicsInfo = await operations.mutate({
    mutation: gql`
      mutation($basic: BasicsInput!, $image: Upload) {
        addBasics(basic: $basic, image: $image) {
          ... on Basics {
            _id
            name {
              lang
              value
            }
            features {
              material {
                _id
              }
              color {
                _id
              }
            }
            images {
              small
              medium
              large
              thumbnail
            }
            available
            additionalPrice {
              value
              currency
            }
          }
          ... on Error {
            message
            statusCode
          }
        }
      }
    `,
    variables: { basic, image },
  });
  return basicsInfo.data.addBasics;
};

const updateBasics = async (id, basic, images, operations) => {
  const basicsInfo = await operations.mutate({
    mutation: gql`
      mutation($id: ID!, $basic: BasicsInput!, $image: Upload) {
        updateBasics(id: $id, basic: $basic, image: $image) {
          ... on Basics {
            _id
            name {
              lang
              value
            }
            features {
              material {
                _id
              }
              color {
                _id
              }
            }
            images {
              small
              medium
              large
              thumbnail
            }
            available
            additionalPrice {
              value
              currency
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
      basic,
      images,
    },
  });
  return basicsInfo.data.updateBasics;
};

const deleteBasics = async (id, operations) => {
  const basicsInfo = await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        deleteBasics(id: $id) {
          ... on Basics {
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
  return basicsInfo.data.deleteBasics;
};

const getAllBasics = async ({ limit, skip, filter }, operations) => {
  const basicsInfo = await operations.query({
    query: gql`
      query($limit: Int!, $skip: Int!, $filter: BasicsFilterInput) {
        getAllBasics(limit: $limit, skip: $skip, filter: $filter) {
          items {
            _id
            name {
              lang
              value
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
          }
        }
      }
    `,
    variables: { limit, skip, filter },
  });
  return basicsInfo.data.getAllBasics.items;
};

const getBasicsById = async (id, operations) => {
  const basicsInfo = await operations.query({
    query: gql`
      query($id: ID!) {
        getBasicsById(id: $id) {
          ... on Basics {
            _id
            name {
              lang
              value
            }
            features {
              material {
                _id
              }
              color {
                _id
              }
            }
            images {
              small
              medium
              large
              thumbnail
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
    variables: { id },
  });
  return basicsInfo.data.getBasicsById;
};

module.exports = {
  createBasics,
  updateBasics,
  deleteBasics,
  getAllBasics,
  getBasicsById,
};
