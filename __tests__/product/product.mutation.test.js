/* eslint-disable no-undef */
const { gql } = require('@apollo/client');
const { setupApp } = require('../helper-functions');
const {
  newModel,
  newCategory,
  newMaterial,
  badProductId,
  getNewProduct,
  getProductForUpdate,
  getSameNameForUpdate,
  createModel,
  getProductData,
  deleteAll,
} = require('./product.variables');

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.model.js');
jest.mock('../../modules/product/product.utils.js');

let product;
let updatedProduct;
let productId;
let sameNameProductId;
let operations;
let categoryId;
let subcategoryId;
let modelId;
let materialId;
let currentProduct = {};
let updatedProductData = {};

describe('Product mutations', () => {
  beforeAll(async done => {
    operations = await setupApp();
    const itemsId = await createModel(newMaterial, newCategory, newModel);
    categoryId = itemsId.categoryId;
    subcategoryId = itemsId.subcategoryId;
    modelId = itemsId.modelId;
    materialId = itemsId.materialId;

    product = getNewProduct(categoryId, subcategoryId, modelId, materialId);
    updatedProduct = getProductForUpdate(
      categoryId,
      subcategoryId,
      modelId,
      materialId
    );
    updatedProductData = getProductData(updatedProduct);

    currentProduct = getProductData(product);
    done();
  });

  test('#1 Should add new product', async done => {
    const createProduct = await operations.mutate({
      mutation: gql`
        mutation($product: ProductInput!) {
          addProduct(upload: [], product: $product) {
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
              available
              isHotItem
              purchasedCount
              rate
              rateCount
            }
          }
        }
      `,
      variables: {
        product,
      },
    });

    productId = createProduct.data.addProduct._id;
    const createdProduct = createProduct.data.addProduct;
    expect(createdProduct).toBeDefined();
    expect(createProduct.data.addProduct).toEqual({
      ...currentProduct,
      _id: productId,
    });
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
      variables: { id: productId },
    });
    const receivedProduct = getProduct.data.getProductById;
    expect(receivedProduct).toBeDefined();
    expect(createProduct.data.addProduct).toEqual({
      ...currentProduct,
      _id: productId,
    });
    done();
  });

  test.skip('#2 AddProduct should return Error product already exist', async done => {
    const createProduct = await operations.mutate({
      mutation: gql`
        mutation($product: ProductInput!) {
          addProduct(upload: [], product: $product) {
            ... on Product {
              _id
            }
            ... on Error {
              statusCode
              message
            }
          }
        }
      `,
      variables: {
        product: getNewProduct(categoryId, subcategoryId, modelId, materialId),
      },
    });
    const error = createProduct.errors[0].message;
    expect(error).toBeDefined();
    expect(error).toEqual('PRODUCT_ALREADY_EXIST');
    done();
  });

  test('#3 Should update new product', async done => {
    const updateProduct = await operations.mutate({
      mutation: gql`
        mutation($product: ProductInput!, $id: ID!) {
          updateProduct(id: $id, product: $product) {
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
      variables: {
        product: updatedProduct,
        id: productId,
      },
    });
    const productAfterUpdate = updateProduct.data.updateProduct;
    expect(productAfterUpdate).toBeDefined();
    expect(productAfterUpdate).toEqual({
      ...updatedProductData,
      _id: productId,
    });
    done();
  });

  test.skip('#4 UpdateProduct should return Error product not found', async done => {
    const updateProduct = await operations.mutate({
      mutation: gql`
        mutation($product: ProductInput!, $id: ID!) {
          updateProduct(id: $id, product: $product) {
            ... on Product {
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
      variables: {
        product: getProductForUpdate(
          categoryId,
          subcategoryId,
          modelId,
          materialId
        ),
        id: badProductId,
      },
    });
    const productAfterUpdate = updateProduct.data.updateProduct;
    expect(productAfterUpdate).toBeDefined();
    expect(productAfterUpdate).toHaveProperty('statusCode', 404);
    expect(productAfterUpdate).toHaveProperty('message', 'PRODUCT_NOT_FOUND');
    done();
  });

  test('#5 deleteProduct should return add fields and delete product', async done => {
    const deletedProduct = await operations.mutate({
      mutation: gql`
        mutation($id: ID!) {
          deleteProduct(id: $id) {
            ... on Product {
              _id
            }
          }
        }
      `,
      variables: { id: productId },
    });

    const result = deletedProduct.data.deleteProduct;
    expect(result).toBeDefined();
    expect(result._id).toBe(productId);
    done();
  });

  test('#6 deleteProduct should return error product not found', async done => {
    const deletedProduct = await operations.mutate({
      mutation: gql`
        mutation($id: ID!) {
          deleteProduct(id: $id) {
            ... on Product {
              _id
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
    const result = deletedProduct.errors[0].message;
    expect(result).toBe('PRODUCT_NOT_FOUND');
    done();
  });

  afterAll(async done => {
    await deleteAll(materialId, productId, categoryId, modelId);
    done();
  });
});
