const { gql } = require('@apollo/client');

const productService = require('../../modules/product/product.service');
const {
  uploadProductImages: uploadImages,
} = require('../../modules/product/product.utils');
const { getCurrencySign } = require('../../utils/product-service');

const createProduct = async (product, operations) => {
  const createdProduct = await operations.mutate({
    mutation: gql`
      mutation ($product: ProductInput!, $upload: Upload!) {
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
  operations.mutate({
    mutation: gql`
      mutation (
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
  operations.query({
    query: gql`
      query ($id: ID!) {
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
const deleteProducts = async (ids, operations) =>
  operations.mutate({
    mutation: gql`
      mutation ($ids: [ID!]) {
        deleteProducts(ids: $ids) {
          ... on Products {
            items {
              _id
            }
          }
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
      ids,
    },
  });
const getAllProductsWithSkipAndLimit = async (skip, limit, operations) =>
  operations.query({
    variables: { skip, limit },
    query: gql`
      query ($skip: Int, $limit: Int) {
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
  operations.query({
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
  operations.query({
    variables: { id },
    query: gql`
      query ($id: ID!) {
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
  operations.query({
    query: gql`
      query {
        getPopularProducts {
          labels
        }
      }
    `,
  });

const getProductsForWishlist = async userId =>
  productService.getProductsForWishlist(userId);

const deleteProductImages = async (id, operations) =>
  operations.mutate({
    mutation: gql`
      mutation ($id: ID!, $images: [String!]!) {
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
  uploadImages(['__tests__/homepage-images/img.png']);

const getFilter = async filterOpts => productService.filterItems(filterOpts);

const getCurrency = (currency, UAH, USD) => getCurrencySign(currency, UAH, USD);

module.exports = {
  deleteProducts,
  createProduct,
  getProductById,
  getAllProductsWithSkipAndLimit,
  updateProduct,
  getAllProductCategoriesForFilter,
  getModelsByCategory,
  getPopularProducts,
  getProductsForWishlist,
  deleteProductImages,
  uploadProductImages,
  getFilter,
  getCurrency,
};
