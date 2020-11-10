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
jest.mock('../../modules/product/product.service.js');

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
  beforeAll(async () => {
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
  });

  test('#1 Should add new product', async () => {
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
  });

  test('#2 AddProduct should return Error product already exist', async () => {
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
  });

  test('#3 Should update new product', async () => {
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
  });

  test('#4 UpdateProduct should return Error product not found', async () => {
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
  });

  test('#5 UpdateProduct should return Error product already exist', async () => {
    const createProduct = await operations.mutate({
      mutation: gql`
        mutation($product: ProductInput!) {
          addProduct(upload: [], product: $product) {
            ... on Product {
              _id
            }
          }
        }
      `,
      variables: {
        product: getSameNameForUpdate(
          categoryId,
          subcategoryId,
          modelId,
          materialId
        ),
      },
    });

    sameNameProductId = createProduct.data.addProduct._id;

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
        product: getSameNameForUpdate(
          categoryId,
          subcategoryId,
          modelId,
          materialId
        ),
        id: productId,
      },
    });
    const productAfterUpdate = updateProduct.data.updateProduct;
    expect(productAfterUpdate).toBeDefined();
    expect(productAfterUpdate).toHaveProperty('statusCode', 400);
    expect(productAfterUpdate).toHaveProperty(
      'message',
      'PRODUCT_ALREADY_EXIST'
    );
    await operations.mutate({
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
      variables: { id: sameNameProductId },
    });
  });

  test('#6 deleteProduct should return add fields and delete product', async () => {
    const deletedProduct = await operations.mutate({
      mutation: gql`
        mutation($id: ID!) {
          deleteProduct(id: $id) {
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
      variables: { id: productId },
    });

    const result = deletedProduct.data.deleteProduct;
    expect(result).toBeDefined();
    expect(result).toHaveProperty('name', [
      { value: updatedProduct.name[0].value },
      { value: updatedProduct.name[1].value },
    ]);
    expect(result).toHaveProperty('description', [
      { value: updatedProduct.description[0].value },
      { value: updatedProduct.description[1].value },
    ]);
    expect(result).toHaveProperty('category', { _id: updatedProduct.category });
    expect(result).toHaveProperty('subcategory', {
      _id: updatedProduct.subcategory,
    });
    expect(result).toHaveProperty('mainMaterial', [
      { value: updatedProduct.mainMaterial[0].value },
      { value: updatedProduct.mainMaterial[1].value },
    ]);
    expect(result).toHaveProperty('innerMaterial', [
      { value: updatedProduct.innerMaterial[0].value },
      { value: updatedProduct.innerMaterial[1].value },
    ]);
    expect(result).toHaveProperty(
      'strapLengthInCm',
      updatedProduct.strapLengthInCm
    );
    expect(result).toHaveProperty('pattern', [
      { value: updatedProduct.pattern[0].value },
      { value: updatedProduct.pattern[1].value },
    ]);
    expect(result).toHaveProperty('closureColor', updatedProduct.closureColor);
    expect(result).toHaveProperty('basePrice', [
      { value: updatedProduct.basePrice[0].value },
      { value: updatedProduct.basePrice[1].value },
    ]);
    expect(result).toHaveProperty('available', updatedProduct.available);
    expect(result).toHaveProperty('isHotItem', updatedProduct.isHotItem);
    expect(result).toHaveProperty('purchasedCount', 0);
    expect(result).toHaveProperty('rate', 0);
    expect(result).toHaveProperty('rateCount', 0);
  });

  test('#7 deleteProduct should return error product not found', async () => {
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
      variables: { id: productId },
    });

    const result = deletedProduct.data.deleteProduct;
    expect(result).toBeDefined();
    expect(result).toHaveProperty('statusCode', 404);
    expect(result).toHaveProperty('message', 'PRODUCT_NOT_FOUND');
  });

  afterAll(async () => {
    await deleteAll(materialId, productId, categoryId, modelId);
  });
});
