const { gql } = require('@apollo/client');

const productService = require('../../modules/product/product.service');
const {
  uploadProductImages: uploadImages,
} = require('../../modules/product/product.utils');
const { getCurrencySign } = require('../../utils/product-service');

const createProduct = async (product, operations) => {
  const createdProduct = await operations.mutate({
    mutation: gql`
      mutation($product: ProductInput!, $upload: Upload!) {
        addProduct(product: $product, upload: $upload) {
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
      upload: ['__tests__/homepage-images/img.png'],
    },
  });

  return createdProduct.data.addProduct;
};
const updateProduct = async (id, product, primary, upload, operations) =>
  await operations.mutate({
    mutation: gql`
      mutation(
        $id: ID!
        $product: ProductInput!
        $upload: Upload
        $primary: Upload
      ) {
        updateProduct(
          id: $id
          product: $product
          upload: $upload
          primary: $primary
        ) {
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
              size {
                _id
              }
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
      upload,
      primary,
    },
  });
const getProductById = async (id, operations) =>
  await operations.query({
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
              size {
                _id
              }
            }
            availableCount
            userRates {
              rate
            }
            rateCount
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

const deleteManyProducts = async (ids, operations) =>
  await operations.mutate({
    mutation: gql`
      mutation($ids: [ID!]) {
        deleteManyProducts(ids: $ids) {
          ... on Product {
            _id
          }
        }
      }
    `,
    variables: {
      ids,
    },
  });
const getAllProductsWithSkipAndLimit = async (skip, limit, operations) =>
  await operations.query({
    variables: { skip, limit },
    query: gql`
      query($skip: Int, $limit: Int) {
        getProducts(skip: $skip, limit: $limit, filter: { colors: [] }) {
          ... on PaginatedProducts {
            items {
              name {
                lang
                value
              }
            }
          }
        }
      }
    `,
  });

const getAllProductCategoriesForFilter = async operations =>
  await operations.query({
    query: gql`
      query {
        getProductsFilters {
          categories {
            _id
          }
        }
      }
    `,
  });

const getModelsByCategory = async (id, operations) =>
  await operations.query({
    variables: { id },
    query: gql`
      query($id: ID!) {
        getModelsByCategory(id: $id) {
          ... on Model {
            _id
            name {
              lang
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
  });

const getPopularProducts = async operations =>
  await operations.query({
    query: gql`
      query {
        getPopularProducts {
          labels
        }
      }
    `,
  });

const getProductsForWishlist = async userId =>
  await productService.getProductsForWishlist(userId);

const getProductsForCart = async userId =>
  await productService.getProductsForCart(userId);

const deleteProductImages = async (id, operations) =>
  await operations.mutate({
    mutation: gql`
      mutation($id: ID!, $images: [String!]!) {
        deleteImages(id: $id, images: $images) {
          ... on PrimaryImage {
            primary {
              large
              medium
              small
              thumbnail
            }
          }
        }
      }
    `,
    variables: {
      id,
      images: ['__tests__/homepage-images/img.png'],
    },
  });

const uploadProductImages = async () =>
  await uploadImages(['__tests__/homepage-images/img.png']);

const getFilter = async filterOpts => productService.filterItems(filterOpts);

const getCurrency = (currency, UAH, USD) => getCurrencySign(currency, UAH, USD);

module.exports = {
  deleteManyProducts,
  createProduct,
  getProductById,
  getAllProductsWithSkipAndLimit,
  updateProduct,
  getAllProductCategoriesForFilter,
  getModelsByCategory,
  getPopularProducts,
  getProductsForWishlist,
  getProductsForCart,
  deleteProductImages,
  uploadProductImages,
  getFilter,
  getCurrency,
};
