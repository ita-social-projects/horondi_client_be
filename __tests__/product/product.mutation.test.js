/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const client = require('../../utils/apollo-test-client');
const {
  badProductId,
  newProduct,
  productForUpdate,
  sameNameForUpdate,
} = require('../../tests-variables/product.variables');

require('dotenv').config();

let productId;
let sameNameProductId;

describe('Product mutations', () => {
  test('#1 Should add new product', async () => {
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
      variables: { product: newProduct },
    });
    productId = createProduct.data.addProduct._id;
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
              basePrice
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
      _id: 'ddc81f5dbac48c38d0403dd3',
    });
    expect(receivedProduct).toHaveProperty('subcategory', {
      __typename: 'Category',
      _id: '688ded7be0c2621f2fb17b05',
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
    expect(receivedProduct).toHaveProperty('basePrice', 1550);
    expect(receivedProduct).toHaveProperty('available', true);
    expect(receivedProduct).toHaveProperty('isHotItem', false);
    expect(receivedProduct).toHaveProperty('purchasedCount', null);
    expect(receivedProduct).toHaveProperty('rate', null);
    expect(receivedProduct).toHaveProperty('rateCount', null);
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
      variables: { product: newProduct },
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
        product: productForUpdate,
        id: productId,
      },
    });
    const productAfterUpdate = updateProduct.data.updateProduct;
    expect(productAfterUpdate).toBeDefined();
    expect(productAfterUpdate).toHaveProperty('name', [
      {
        __typename: 'Language',
        lang: 'en',
        value: 'Bad Baggy',
      },
      {
        __typename: 'Language',
        lang: 'ua',
        value: 'Жахливий Рюкзачечок',
      },
    ]);
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
        product: productForUpdate,
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
      variables: { product: sameNameForUpdate },
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
        product: sameNameForUpdate,
        id: productId,
      },
    });
    const productAfterUpdate = updateProduct.data.updateProduct;
    expect(productAfterUpdate).toBeDefined();
    expect(productAfterUpdate).toHaveProperty('statusCode', 400);
    expect(productAfterUpdate).toHaveProperty(
      'message',
      'PRODUCT_ALREADY_EXIST',
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

  test('#6 deleteProduct should return productId and ', async () => {
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
    expect(result).toHaveProperty('_id', productId);
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
});
