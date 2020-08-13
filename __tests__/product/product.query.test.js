/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const client = require('../../utils/apollo-test-client');
const {
  badProductId,
  newProduct,
  expectedResult,
} = require('./product.variables');
require('dotenv').config();

let productId;

describe('Product queries', () => {
  beforeAll(async () => {
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
  });
  test('#1 Should receive all products', async () => {
    const products = await client.query({
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
              basePrice
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
    expect(allProducts).toMatchSnapshot();
    expect(allProducts).toBeDefined();
    expect(allProducts.length).toBeGreaterThan(0);
    expect(allProducts[0].name).toBeInstanceOf(Array);
    expect(allProducts).toContainEqual(expectedResult);
  });
  test('#2 Should receive product by ID', async () => {
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
  test('#3 Should receive error if product ID is wrong', async () => {
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
      variables: { id: badProductId },
    });
    const receivedError = getProduct.data.getProductById;
    expect(receivedError).toBeDefined();
    expect(receivedError).toHaveProperty('statusCode', 404);
    expect(receivedError).toHaveProperty('message', 'PRODUCT_NOT_FOUND');
  });
  afterAll(async () => {
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
  });
});
