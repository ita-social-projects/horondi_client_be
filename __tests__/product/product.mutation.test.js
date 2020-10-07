/* eslint-disable no-undef */
const { gql } = require('@apollo/client');
const client = require('../../utils/apollo-test-client');
const { setupApp } = require('../helper-functions');
const {
  newModel,
  newCategory,
  newMaterial,
  badProductId,
  getNewProduct,
  getProductForUpdate,
  getSameNameForUpdate,
} = require('./product.variables');

require('dotenv').config();

let productId;
let categoryId;
let subcategoryId;
let modelId;
let sameNameProductId;
let materialId;

describe('Product mutations', () => {
  beforeAll(async () => {
    const createMaterial = await client.mutate({
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

    const createCategory = await client.mutate({
      mutation: gql`
        mutation($category: CategoryInput!) {
          addCategory(category: $category) {
            ... on Category {
              _id
              name {
                value
              }
            }
          }
        }
      `,
      variables: { category: newCategory },
    });
    categoryId = createCategory.data.addCategory._id;
    subcategoryId = createCategory.data.addCategory._id;

    const createModel = await client.mutate({
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
  });

  test('#1 Should add new product', async () => {
    const createProduct = await client.mutate({
      mutation: gql`
        mutation($product: ProductInput!) {
          addProduct(product: $product) {
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
          }
        }
      `,
      variables: {
        product: getNewProduct(categoryId, subcategoryId, modelId, materialId),
      },
    });
    productId = createProduct.data.addProduct._id;
    const createdProduct = createProduct.data.addProduct;
    expect(createdProduct).toBeDefined();
    expect(createdProduct).toHaveProperty('name', [
      { __typename: 'Language', value: 'Very Coool Baggy' },
      { __typename: 'Language', value: 'ДУЖЕ СУПЕРСЬКИЙ Рюкзачечок' },
    ]);
    expect(createdProduct).toHaveProperty('description', [
      { __typename: 'Language', value: 'Baggy is so cool' },
      { __typename: 'Language', value: 'Рюкзачечок - супер кльовий))' },
    ]);
    expect(createdProduct).toHaveProperty('category', {
      __typename: 'Category',
      _id: categoryId,
    });
    expect(createdProduct).toHaveProperty('subcategory', {
      __typename: 'Category',
      _id: categoryId,
    });
    expect(createdProduct).toHaveProperty('mainMaterial', [
      {
        __typename: 'Language',
        value: 'Canvas-400G прошита додатковим шаром спеціального матеріалу',
      },
      {
        __typename: 'Language',
        value:
          'Canvas-400G padded with a layer of durable and water-resistant material',
      },
    ]);
    expect(createdProduct).toHaveProperty('innerMaterial', [
      {
        __typename: 'Language',
        value: 'Oxford 135',
      },
      {
        __typename: 'Language',
        value: 'Oxford 135',
      },
    ]);
    expect(createdProduct).toHaveProperty('strapLengthInCm', 100);
    expect(createdProduct).toHaveProperty('pattern', [
      {
        __typename: 'Language',
        value: 'Вишивка',
      },
      {
        __typename: 'Language',
        value: 'Embroidery',
      },
    ]);
    expect(createdProduct).toHaveProperty('closureColor', 'black');
    expect(createdProduct).toHaveProperty('basePrice', [
      {
        __typename: 'CurrencySet',
        value: 145000,
      },
      {
        __typename: 'CurrencySet',
        value: 5229,
      },
    ]);
    expect(createdProduct).toHaveProperty('available', true);
    expect(createdProduct).toHaveProperty('isHotItem', false);
    expect(createdProduct).toHaveProperty('purchasedCount', 0);
    expect(createdProduct).toHaveProperty('rate', 0);
    expect(createdProduct).toHaveProperty('rateCount', 0);
    const getProduct = await client.query({
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
      variables: { id: productId },
    });
    const receivedProduct = getProduct.data.getProductById;
    expect(receivedProduct).toBeDefined();
    expect(receivedProduct).toHaveProperty('name', [
      { __typename: 'Language', value: 'Very Coool Baggy' },
      { __typename: 'Language', value: 'ДУЖЕ СУПЕРСЬКИЙ Рюкзачечок' },
    ]);
    expect(receivedProduct).toHaveProperty('description', [
      { __typename: 'Language', value: 'Baggy is so cool' },
      { __typename: 'Language', value: 'Рюкзачечок - супер кльовий))' },
    ]);
    expect(receivedProduct).toHaveProperty('category', {
      __typename: 'Category',
      _id: categoryId,
    });
    expect(receivedProduct).toHaveProperty('subcategory', {
      __typename: 'Category',
      _id: categoryId,
    });
    expect(receivedProduct).toHaveProperty('mainMaterial', [
      {
        __typename: 'Language',
        value: 'Canvas-400G прошита додатковим шаром спеціального матеріалу',
      },
      {
        __typename: 'Language',
        value:
          'Canvas-400G padded with a layer of durable and water-resistant material',
      },
    ]);
    expect(receivedProduct).toHaveProperty('innerMaterial', [
      {
        __typename: 'Language',
        value: 'Oxford 135',
      },
      {
        __typename: 'Language',
        value: 'Oxford 135',
      },
    ]);
    expect(receivedProduct).toHaveProperty('strapLengthInCm', 100);
    expect(receivedProduct).toHaveProperty('pattern', [
      {
        __typename: 'Language',
        value: 'Вишивка',
      },
      {
        __typename: 'Language',
        value: 'Embroidery',
      },
    ]);
    expect(receivedProduct).toHaveProperty('closureColor', 'black');
    expect(receivedProduct).toHaveProperty('basePrice', [
      {
        __typename: 'CurrencySet',
        value: 145000,
      },
      {
        __typename: 'CurrencySet',
        value: 5229,
      },
    ]);
    expect(receivedProduct).toHaveProperty('available', true);
    expect(receivedProduct).toHaveProperty('isHotItem', false);
    expect(receivedProduct).toHaveProperty('purchasedCount', 0);
    expect(receivedProduct).toHaveProperty('rate', 0);
    expect(receivedProduct).toHaveProperty('rateCount', 0);
  });

  test('#2 AddProduct should return Error product already exist', async () => {
    const createProduct = await client.mutate({
      mutation: gql`
        mutation($product: ProductInput!) {
          addProduct(product: $product) {
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
    const result = createProduct.data.addProduct;
    expect(result).toBeDefined();
    expect(result).toHaveProperty('statusCode', 400);
    expect(result).toHaveProperty('message', 'PRODUCT_ALREADY_EXIST');
  });

  test('#3 Should update new product', async () => {
    const updateProduct = await client.mutate({
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
      variables: {
        product: getProductForUpdate(
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
    expect(productAfterUpdate).toHaveProperty('name', [
      { __typename: 'Language', value: 'Bad Baggy' },
      { __typename: 'Language', value: 'Жахливий Рюкзачечок' },
    ]);
    expect(productAfterUpdate).toHaveProperty('description', [
      { value: 'Baggy is so bad', __typename: 'Language' },
      { value: 'Рюкзачечок - не добрий))', __typename: 'Language' },
    ]);
    expect(productAfterUpdate).toHaveProperty('category', {
      __typename: 'Category',
      _id: categoryId,
    });
    expect(productAfterUpdate).toHaveProperty('subcategory', {
      __typename: 'Category',
      _id: subcategoryId,
    });
    expect(productAfterUpdate).toHaveProperty('mainMaterial', [
      {
        __typename: 'Language',
        value: 'Canvas-400QQ прошита без спеціального матеріалу',
      },
      {
        __typename: 'Language',
        value: 'Canvas-400QQ padded without a layer water-resistant material',
      },
    ]);
    expect(productAfterUpdate).toHaveProperty('innerMaterial', [
      {
        __typename: 'Language',
        value: 'Oxford 115',
      },
      {
        __typename: 'Language',
        value: 'Oxford 115',
      },
    ]);
    expect(productAfterUpdate).toHaveProperty('strapLengthInCm', 90);
    expect(productAfterUpdate).toHaveProperty('pattern', [
      { value: 'Вишивочка', __typename: 'Language' },
      { value: 'Embroidery', __typename: 'Language' },
    ]);
    expect(productAfterUpdate).toHaveProperty('closureColor', 'white');
    expect(productAfterUpdate).toHaveProperty('basePrice', [
      { value: 777000, __typename: 'CurrencySet' },
      { value: 7779, __typename: 'CurrencySet' },
    ]);
    expect(productAfterUpdate).toHaveProperty('available', false);
    expect(productAfterUpdate).toHaveProperty('isHotItem', true);
    expect(productAfterUpdate).toHaveProperty('purchasedCount', 0);
    expect(productAfterUpdate).toHaveProperty('rate', 0);
    expect(productAfterUpdate).toHaveProperty('rateCount', 0);
  });

  test('#4 UpdateProduct should return Error product not found', async () => {
    const updateProduct = await client.mutate({
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
    const createProduct = await client.mutate({
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
        product: getSameNameForUpdate(
          categoryId,
          subcategoryId,
          modelId,
          materialId
        ),
      },
    });
    sameNameProductId = createProduct.data.addProduct._id;

    const updateProduct = await client.mutate({
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
    await client.mutate({
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
    const deletedProduct = await client.mutate({
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
    expect(result).toHaveProperty('_id', productId);
    expect(result).toHaveProperty('name', [
      { __typename: 'Language', value: 'Bad Baggy' },
      { __typename: 'Language', value: 'Жахливий Рюкзачечок' },
    ]);
    expect(result).toHaveProperty('description', [
      { value: 'Baggy is so bad', __typename: 'Language' },
      { value: 'Рюкзачечок - не добрий))', __typename: 'Language' },
    ]);
    expect(result).toHaveProperty('category', {
      __typename: 'Category',
      _id: categoryId,
    });
    expect(result).toHaveProperty('subcategory', {
      __typename: 'Category',
      _id: categoryId,
    });
    expect(result).toHaveProperty('mainMaterial', [
      {
        __typename: 'Language',
        value: 'Canvas-400QQ прошита без спеціального матеріалу',
      },
      {
        __typename: 'Language',
        value: 'Canvas-400QQ padded without a layer water-resistant material',
      },
    ]);
    expect(result).toHaveProperty('innerMaterial', [
      {
        __typename: 'Language',
        value: 'Oxford 115',
      },
      {
        __typename: 'Language',
        value: 'Oxford 115',
      },
    ]);
    expect(result).toHaveProperty('strapLengthInCm', 90);
    expect(result).toHaveProperty('pattern', [
      { value: 'Вишивочка', __typename: 'Language' },
      { value: 'Embroidery', __typename: 'Language' },
    ]);
    expect(result).toHaveProperty('closureColor', 'white');
    expect(result).toHaveProperty('basePrice', [
      { value: 777000, __typename: 'CurrencySet' },
      { value: 7779, __typename: 'CurrencySet' },
    ]);
    expect(result).toHaveProperty('available', false);
    expect(result).toHaveProperty('isHotItem', true);
    expect(result).toHaveProperty('purchasedCount', 0);
    expect(result).toHaveProperty('rate', 0);
    expect(result).toHaveProperty('rateCount', 0);
  });

  test('#7 deleteProduct should return error product not found', async () => {
    const deletedProduct = await client.mutate({
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
    await client.mutate({
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
    await client.mutate({
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
    await client.mutate({
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
    await client.mutate({
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
