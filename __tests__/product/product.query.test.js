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
        product: getNewProduct(categoryId, subcategoryId, modelId, materialId),
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
    const product = await operations.query({
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
    const resultProduct = product.data.getProductById;
    expect(resultProduct).toBeDefined();
    expect(resultProduct).toHaveProperty('name', [
      { value: 'Very Coool Baggy' },
      { value: 'ДУЖЕ СУПЕРСЬКИЙ Рюкзачечок' },
    ]);
    expect(resultProduct).toHaveProperty('description', [
      { value: 'Baggy is so cool' },
      { value: 'Рюкзачечок - супер кльовий))' },
    ]);
    expect(resultProduct).toHaveProperty('category', {
      _id: categoryId,
    });
    expect(resultProduct).toHaveProperty('subcategory', {
      _id: subcategoryId,
    });
    expect(resultProduct).toHaveProperty('mainMaterial', [
      {
        value: 'Canvas-400G прошита додатковим шаром спеціального матеріалу',
      },
      {
        value:
          'Canvas-400G padded with a layer of durable and water-resistant material',
      },
    ]);
    expect(resultProduct).toHaveProperty('innerMaterial', [
      {
        value: 'Oxford 135',
      },
      {
        value: 'Oxford 135',
      },
    ]);
    expect(resultProduct).toHaveProperty('strapLengthInCm', 100);
    expect(resultProduct).toHaveProperty('pattern', [
      {
        value: 'Вишивка',
      },
      {
        value: 'Embroidery',
      },
    ]);
    expect(resultProduct).toHaveProperty('closureColor', 'black');
    expect(resultProduct).toHaveProperty('basePrice', [
      {
        value: 145000,
      },
      {
        value: 5229,
      },
    ]);
    expect(resultProduct).toHaveProperty('available', true);
    expect(resultProduct).toHaveProperty('isHotItem', false);
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
