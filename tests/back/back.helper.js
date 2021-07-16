const { gql } = require('@apollo/client');

const createBack = async (back, operations) => {
  const createdBack = await operations.mutate({
    mutation: gql`
      mutation($back: BackInput!, $upload: Upload) {
        addBack(back: $back, upload: $upload) {
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
    variables: {
      back,
      upload: '../___test__/model/dog.img',
    },
  });

  return createdBack.data.addBack;
};
const updateBack = async (id, back, operations) => {
  const updatedBack = await operations.mutate({
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
      upload: '../___test__/model/dog.img',
    },
  });

  return updatedBack.data.updateBack;
};
const getAllBacks = async operations => {
  const allBacks = await operations.query({
    query: gql`
      query {
        getAllBacks {
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
            images{
              large
            }
            available
            additionalPrice
          }
          count
        }
      }
    `,
  });

  return allBacks.data.getAllBacks.items;
};
const getBackById = async (id, operations) => {
  const backById = await operations.query({
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

  return backById.data.getBackById;
};
const deleteBack = async (id, operations) => {
  const res = await operations.mutate({
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
  return res.data.deleteBack;
};

module.exports = {
  deleteBack,
  createBack,
  getAllBacks,
  getBackById,
  updateBack,
};
