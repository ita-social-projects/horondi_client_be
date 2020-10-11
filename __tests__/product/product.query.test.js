/* eslint-disable no-undef */
const { gql } = require('@apollo/client');
const { setupApp } = require('../helper-functions');
const {
  newModel,
  newCategory,
  newMaterial,
  badProductId,
  getNewProduct,
} = require('./product.variables');

jest.mock('../../modules/upload/upload.service');

let product;
let productId;
let categoryId;
let subcategoryId;
let modelId;
let materialId;
let operations;

describe('Product queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
    const createMaterial = await operations.mutate({
      mutation: gql`
        mutation($material: MaterialInput!) {
          addMaterial(material: $material) {
            ... on Material {
              _id
              name {
                value
              }
            }
          }
        }
      `,
      variables: { material: newMaterial },
    });
    materialId = createMaterial.data.addMaterial._id;
    const createCategory = await operations.mutate({
      mutation: gql`
        mutation($category: CategoryInput!, $upload: Upload) {
          addCategory(category: $category, upload: $upload) {
            ... on Category {
              _id
              name {
                value
              }
            }
          }
        }
      `,
      variables: {
        category: newCategory,
        upload: '../___test__/model/dog.img',
      },
    });
    categoryId = createCategory.data.addCategory._id;
    subcategoryId = createCategory.data.addCategory._id;

    const createModel = await operations.mutate({
      mutation: gql`
        mutation($model: ModelInput!) {
          addModel(model: $model) {
            ... on Model {
              _id
              name {
                value
              }
            }
          }
        }
      `,
      variables: { model: { ...newModel, category: categoryId } },
    });

    modelId = createModel.data.addModel._id;

    product = getNewProduct(categoryId, subcategoryId, modelId, materialId);

    const createProduct = await operations.mutate({
      mutation: gql`
        mutation($product: ProductInput!) {
          addProduct(product: $product) {
            ... on Product {
              _id
            }
          }
        }
      `,
      variables: {
        product,
      },
    });
    productId = createProduct.data.addProduct._id;
  });
  test('#1 Should receive all products', async () => {
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
    expect(allProducts[0].name).toBeInstanceOf(Array);
  });
  test('#2 Should receive product by ID', async () => {
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
              basePrice {
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
    expect(resultProduct).toHaveProperty('name', [
      { value: product.name[0].value },
      { value: product.name[1].value },
    ]);
    expect(resultProduct).toHaveProperty('description', [
      { value: product.description[0].value },
      { value: product.description[1].value },
    ]);
    expect(resultProduct).toHaveProperty('category', {
      _id: product.category,
    });
    expect(resultProduct).toHaveProperty('subcategory', {
      _id: product.subcategory,
    });
    expect(resultProduct).toHaveProperty('mainMaterial', [
      { value: product.mainMaterial[0].value },
      { value: product.mainMaterial[1].value },
    ]);
    expect(resultProduct).toHaveProperty('innerMaterial', [
      { value: product.innerMaterial[0].value },
      { value: product.innerMaterial[1].value },
    ]);
    expect(resultProduct).toHaveProperty(
      'strapLengthInCm',
      product.strapLengthInCm
    );
    expect(resultProduct).toHaveProperty('pattern', [
      { value: product.pattern[0].value },
      { value: product.pattern[1].value },
    ]);
    expect(resultProduct).toHaveProperty('closureColor', product.closureColor);
    expect(resultProduct).toHaveProperty('basePrice', [
      { value: product.basePrice[0].value },
      { value: product.basePrice[1].value },
    ]);
    expect(resultProduct).toHaveProperty('available', product.available);
    expect(resultProduct).toHaveProperty('isHotItem', product.isHotItem);
    expect(resultProduct).toHaveProperty('purchasedCount', 0);
    expect(resultProduct).toHaveProperty('rate', 0);
    expect(resultProduct).toHaveProperty('rateCount', 0);
  });
  test('#3 Should receive error if product ID is wrong', async () => {
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
  });
  afterAll(async () => {
    await operations.mutate({
      mutation: gql`
        mutation($id: ID!) {
          deleteMaterial(id: $id) {
            ... on Material {
              _id
            }
            ... on Error {
              statusCode
              message
            }
          }
        }
      `,
      variables: { id: materialId },
    });
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
      variables: { id: productId },
    });
    await operations.mutate({
      mutation: gql`
        mutation($id: ID!) {
          deleteCategory(id: $id) {
            ... on Category {
              _id
            }
            ... on Error {
              statusCode
              message
            }
          }
        }
      `,
      variables: { id: categoryId },
    });
    await operations.mutate({
      mutation: gql`
        mutation($id: ID!) {
          deleteModel(id: $id) {
            ... on Model {
              _id
            }
            ... on Error {
              statusCode
              message
            }
          }
        }
      `,
      variables: { id: modelId },
    });
  });
});
