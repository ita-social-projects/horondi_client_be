const { gql } = require('@apollo/client');

const createBack = async (back, operations) => {
  const result = await operations.mutate({
    mutation: gql`
      mutation($back: BackInput!) {
        addBack(back: $back) {
          ... on Back {
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
            }
            images {
              large
              medium
              small
              thumbnail
            }
            available
            customizable
            additionalPrice
            optionType
          }
          ... on Error {
            message
            statusCode
          }
        }
      }
    `,
    variables: { back },
  });
  return result.data.addBack;
};
const updateBack = async (id, back, operations) => {
  const result = await operations.mutate({
    mutation: gql`
      mutation($id: ID!, $back: BackInput!, $upload: Upload) {
        updateBack(id: $id, back: $back, upload: $upload) {
            ... on Back {
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
                }
                image
                available
                additionalPrice
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
      back,
    },
  });

  return result.data.updateBack;
};
const getAllBacks = async operations => {
  const result = await operations.query({
    query: gql`
      query {
        getAllBacks {
            _id
            name {
              lang
              value
            }
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
            }
            image
            available
            additionalPrice
          }
          count
        }
      }
    `,
  });

  return result.data.getAllBacks.items;
};
const getBackById = async (id, operations) => {
  const result = await operations.query({
    query: gql`
      query($id: ID!) {
        getBackById(id: $id) {
          ... on Back {
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
            }
            available
            additionalPrice
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

  return result.data.getBackById;
};
const deleteBack = async (id, operations) => {
  const result = await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        deleteBack(deleteId: $id, switchId: $id) {
          ... on Back {
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
  return result.data.deleteBack;
};

module.exports = {
  deleteBack,
  createBack,
  getAllBacks,
  getBackById,
  updateBack,
};
