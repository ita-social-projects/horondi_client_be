const { gql } = require('@apollo/client');

const createBasics = async (basic, image, operations) => {
  const basicsInfo = await operations.mutate({
    mutation: gql`
      mutation($basic: BasicsInput!, $image: Upload) {
        addBasic(basic: $basic, image: $image) {
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
              type
              value
            }
            translationsKey
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
  return basicsInfo.data.addBasic;
};

const updateBasic = async (id, basic, images, operations) => {
  const basicsInfo = await operations.mutate({
    mutation: gql`
      mutation($id: ID!, $basic: BasicsInput!, $image: Upload) {
        updateBasic(id: $id, basic: $basic, image: $image) {
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
              type
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
      basic,
      images,
    },
  });
  return basicsInfo.data.updateBasic;
};

const deleteBasic = async (id, operations) => {
  const basicsInfo = await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        deleteBasic(id: $id) {
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
  return basicsInfo.data.deleteBasic;
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

const getBasicById = async (id, operations) => {
  const basicsInfo = await operations.query({
    query: gql`
      query($id: ID!) {
        getBasicById(id: $id) {
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
  return basicsInfo.data.getBasicById;
};

module.exports = {
  createBasics,
  updateBasic,
  deleteBasic,
  getAllBasics,
  getBasicById,
};
