/* eslint-disable no-undef */
const { gql } = require('@apollo/client');
const { setupApp } = require('../helper-functions');
const {
  newModel,
  newCategory,
  newMaterial,
  createModel,
  badProductId,
  getNewProduct,
  getProductData,
  deleteAll,
  model,
} = require('./product.variables');

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.model.js');
jest.mock('../../modules/product/product.utils.js');

let product;
let productId;
let operations;
let currentProduct;
let categoryId;
let subcategoryId;
let modelId;
let materialId;

describe('Product queries', () => {
  beforeAll(async done => {
    operations = await setupApp();
    const model = await createModel(newMaterial, newCategory, newModel);
    categoryId = model.categoryId;
    subcategoryId = model.subcategoryId;
    modelId = model.modelId;
    materialId = model.materialId;
    product = getNewProduct(categoryId, subcategoryId, modelId, materialId);
    currentProduct = getProductData(product);

    const createProduct = await operations.mutate({
      mutation: gql`
        mutation($product: ProductInput!) {
          addProduct(upload: [], product: $product) {
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
    productId = createProduct.data.addProduct._id;
    done();
  });
  test('#1 Should receive all products', async done => {
    const products = await operations.query({
      query: gql`
        query {
          getProducts {
            items {
              category {
                _id
              }
              subcategory {
                _id
              }
              name {
                value
              }
              description {
                value
              }
              mainMaterial {
                value
              }
              innerMaterial {
                value
              }
              strapLengthInCm
              pattern {
                value
              }
              closureColor
              basePrice {
                value
              }
              available
              isHotItem
              purchasedCount
              rate
              rateCount
            }
          }
        }
      `,
    });
    const allProducts = products.data.getProducts.items;
    expect(allProducts).toBeDefined();
    expect(allProducts.length).toBeGreaterThan(0);
    done();
  });
  test('#2 Should receive product by ID', async done => {
    const resevedProduct = await operations.query({
      query: gql`
        query($id: ID!) {
          getProductById(id: $id) {
            ... on Product {
              _id
              name {
                value
              }
              model {
                value
              }
              category {
                _id
              }
              subcategory {
                _id
              }
              mainMaterial {
                value
              }
              description {
                value
              }
              innerMaterial {
                value
              }
              strapLengthInCm
              pattern {
                value
              }
              available
              closureColor
              purchasedCount
              isHotItem
              rateCount
              rate
            }
            ... on Error {
              statusCode
              message
            }
          }
        }
      `,
      variables: { id: productId },
    });

    const resultProduct = resevedProduct.data.getProductById;
    expect(resultProduct).toBeDefined();
    expect(resultProduct).toEqual({
      ...currentProduct,
      _id: productId,
      model,
    });
    done();
  });
  test('#3 Should receive error if product ID is wrong', async done => {
    const getProduct = await operations.query({
      query: gql`
        query($id: ID!) {
          getProductById(id: $id) {
            ... on Product {
              _id
              category {
                _id
              }
              subcategory {
                _id
              }
              name {
                value
              }
              description {
                value
              }
              mainMaterial {
                value
              }
              innerMaterial {
                value
              }
              strapLengthInCm
              pattern {
                value
              }
              closureColor
              basePrice {
                value
              }
              available
              isHotItem
              purchasedCount
              rate
              rateCount
            }
            ... on Error {
              statusCode
              message
            }
          }
        }
      `,
      variables: { id: badProductId },
    });
    const receivedError = getProduct.data.getProductById;
    expect(receivedError).toBeDefined();
    expect(receivedError).toHaveProperty('statusCode', 404);
    expect(receivedError).toHaveProperty('message', 'PRODUCT_NOT_FOUND');
    done();
  });
  afterAll(async done => {
    await deleteAll(materialId, productId, categoryId, modelId);
    done();
  });
});
