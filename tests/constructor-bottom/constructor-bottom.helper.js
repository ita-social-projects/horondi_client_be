const { gql } = require('@apollo/client');

const createConstructorBottom = async (constructorElement, operations) => {
  const constructorBottom = await operations.mutate({
    mutation: gql`
      mutation($constructorElement: ConstructorBottomInput!) {
        addConstructorBottom(constructorElement: $constructorElement) {
          ... on ConstructorBottom {
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
                name {
                  lang
                  value
                }
                purpose
                available
              }
              color {
                _id
                colorHex
              }
            }
            image
            available
            default
            basePrice {
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
    variables: { constructorElement },
  });
  return constructorBottom.data.addConstructorBottom;
};
const updateConstructorBottom = async (id, constructorElement, operations) => {
  const updateConstructor = await operations.mutate({
    mutation: gql`
      mutation($id: ID!, $constructorElement: ConstructorBottomInput!) {
        updateConstructorBottom(
          id: $id
          constructorElement: $constructorElement
        ) {
          ... on ConstructorBottom {
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
                name {
                  lang
                  value
                }
                purpose
                available
              }
              color {
                _id
                colorHex
              }
            }
            image
            available
            default
            basePrice {
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
      constructorElement,
    },
  });
  return updateConstructor.data.updateConstructorBottom;
};
const deleteConstructorBottom = async (constructorId, operations) => {
  const deletedConstructor = await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        deleteConstructorBottom(id: $id) {
          ... on ConstructorBottom {
            _id
          }
        }
      }
    `,
    variables: { id: constructorId },
  });
  return deletedConstructor.data.deleteConstructorBottom;
};
const getConstructorBottomById = async (id, operations) => {
  const constructorBottomById = await operations.query({
    query: gql`
      query($id: ID!) {
        getConstructorBottomById(id: $id) {
          ... on ConstructorBottom {
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
                name {
                  lang
                  value
                }
                purpose
                available
              }
              color {
                _id
                colorHex
              }
            }
            image
            available
            default
            basePrice {
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
    variables: { id: id },
  });
  return constructorBottomById.data.getConstructorBottomById;
};
const getAllConstructorBottom = async operations => {
  const allConstructorBottom = await operations.query({
    query: gql`
      query($limit: Int, $skip: Int) {
        getAllConstructorBottom(limit: $limit, skip: $skip) {
          items {
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
                name {
                  lang
                  value
                }
                purpose
                available
              }
              color {
                _id
                colorHex
              }
            }
            image
            available
            default
            basePrice {
              currency
              value
            }
          }
        }
      }
    `,
  });
  console.log(allConstructorBottom.data);
  return allConstructorBottom.data.getAllConstructorBottom.items;
};

module.exports = {
  createConstructorBottom,
  updateConstructorBottom,
  deleteConstructorBottom,
  getConstructorBottomById,
  getAllConstructorBottom,
};
