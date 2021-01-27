const { gql } = require('@apollo/client');

const createProduct = async (product, operations) => {
  const createdProduct = await operations.mutate({
    mutation: gql`
      mutation($product: ProductInput!) {
        addProduct(product: $product, upload: []) {
          ... on Product {
            _id
          }
          ... on Error {
            message
          }
        }
      }
    `,
    variables: {
      product,
    },
  });

  return createdProduct.data.addProduct._id;
};

const updateProduct = async (id, product, operations) => {
  const updatedProduct = await operations.mutate({
    mutation: gql`
      mutation($id: ID!, $product: ProductInput!) {
        updateProduct(id: $id, product: $product, upload: []) {
          ... on Product {
            _id
            category {
              _id
            }
            model {
              _id
            }
            name {
              lang
              value
            }
            description {
              lang
              value
            }
            mainMaterial {
              material {
                _id
              }
              color {
                _id
              }
            }
            innerMaterial {
              material {
                _id
              }
              color {
                _id
              }
            }
            bottomMaterial {
              material {
                _id
              }
              color {
                _id
              }
            }
            strapLengthInCm
            closure {
              _id
            }
            pattern {
              _id
            }
            sizes {
              _id
            }
            availableCount
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
      product,
    },
  });

  return updatedProduct;
};

const createProductSecond = async (product, operations) => {
  const createdProduct = await operations.mutate({
    mutation: gql`
      mutation($product: ProductInput!) {
        addProduct(product: $product, upload: []) {
          ... on Product {
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
      product,
    },
  });

  return createdProduct;
};
const getProductById = async (id, operations) => {
  const ConstructorBasicById = await operations.query({
    query: gql`
      query($id: ID!) {
        getProductById(id: $id) {
          ... on Product {
            _id
            category {
              _id
            }
            model {
              _id
            }
            name {
              lang
              value
            }
            description {
              lang
              value
            }
            mainMaterial {
              material {
                _id
              }
              color {
                _id
              }
            }
            innerMaterial {
              material {
                _id
              }
              color {
                _id
              }
            }
            bottomMaterial {
              material {
                _id
              }
              color {
                _id
              }
            }
            bottomMaterial {
              material {
                _id
              }
              color {
                _id
              }
            }
            strapLengthInCm
            closure {
              _id
            }
            pattern {
              _id
            }
            sizes {
              _id
            }
            availableCount
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
  return ConstructorBasicById;
};
const deleteProduct = async (id, operations) => {
  return await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        deleteProduct(id: $id) {
          ... on Product {
            _id
          }
          ... on Error {
            message
          }
        }
      }
    `,
    variables: {
      id,
    },
  });
};
const getAllProductsWithSkipAndLimit = async (skip, limit, operations) => {
  return await operations.query({
    variables: { skip, limit },
    query: gql`
      query($skip: Int, $limit: Int) {
        getProducts(skip: $skip, limit: $limit, filter: { colors: [] }) {
          items {
            name {
              lang
              value
            }
          }
        }
      }
    `,
  });
};

module.exports = {
  deleteProduct,
  createProduct,
  getProductById,
  createProductSecond,
  getAllProductsWithSkipAndLimit,
  updateProduct,
};
