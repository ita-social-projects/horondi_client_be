/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const client = require('../../utils/apollo-test-client');
require('dotenv').config();

let productId;
const badProductId = '1a1111da11da1111111a111a';

const newProduct = {
  category: 'ddc81f5dbac48c38d0403dd3',
  subcategory: '688ded7be0c2621f2fb17b05',
  name: [
    { lang: 'en', value: 'Very Coool Baggy' },
    { lang: 'ua', value: 'ДУЖЕ СУПЕРСЬКИЙ Рюкзачечок' },
  ],
  description: [
    { lang: 'en', value: 'Baggy is so cool' },
    { lang: 'ua', value: 'Рюкзачечок - супер кльовий))' },
  ],
  mainMaterial: [
    {
      lang: 'uk',
      value: 'Canvas-400G прошита додатковим шаром спеціального матеріалу',
    },
    {
      lang: 'en',
      value:
        'Canvas-400G padded with a layer of durable and water-resistant material',
    },
  ],
  innerMaterial: [
    { lang: 'uk', value: 'Oxford 135' },
    { lang: 'en', value: 'Oxford 135' },
  ],
  pattern: [
    { lang: 'uk', value: 'Вишивка' },
    { lang: 'en', value: 'Embroidery' },
  ],
  patternImages: {
    large: 'large-embroidery.jpg',
    medium: 'medium-embroidery.jpg',
    small: 'small-embroidery.jpg',
    thumbnail: 'thumbnail-embroidery.jpg',
  },
  strapLengthInCm: 100,
  closure: [
    { lang: 'uk', value: 'Фастекс (пластикова защіпка)' },
    { lang: 'en', value: 'Plastic closure' },
  ],
  closureColor: 'black',
  basePrice: [
    { currency: 'UAH', value: 145000 },
    { currency: 'USD', value: 5229 },
  ],
  available: true,
  isHotItem: false,
  images: {
    primary: {
      large: 'large-primary_15.jpg',
      medium: 'medium-primary_15.jpg',
      small: 'small-primary_15.jpg',
      thumbnail: 'thumbnail-primary_15.jpg',
    },
    additional: [
      {
        large: 'large-additional_15_1.jpg',
        medium: 'medium-additional_15_1.jpg',
        small: 'small-additional_15_1.jpg',
        thumbnail: 'thumbnail-additional_15_1.jpg',
      },
      {
        large: 'large-additional_15_2.jpg',
        medium: 'medium-additional_15_2.jpg',
        small: 'small-additional_15_2.jpg',
        thumbnail: 'thumbnail-additional_15_2.jpg',
      },
      {
        large: 'large-additional_15_3.jpg',
        medium: 'medium-additional_15_3.jpg',
        small: 'small-additional_15_3.jpg',
        thumbnail: 'thumbnail-additional_15_3.jpg',
      },
    ],
  },
  colors: [
    {
      code: 206,
      name: [
        { lang: 'uk', value: 'Золотий' },
        { lang: 'en', value: 'Golden' },
      ],
      images: {
        large: 'large-golden.jpg',
        medium: 'medium-golden.jpg',
        small: 'small-golden.jpg',
        thumbnail: 'thumbnail-golden.jpg',
      },
      available: true,
      simpleName: [
        { lang: 'uk', value: 'жовтий' },
        { lang: 'en', value: 'yellow' },
      ],
    },
  ],
  options: [
    {
      size: '50288e8716e80d9569f64e2e',
      bottomMaterial: 'dadba32060da96e40847166d',
      description: [
        { lang: 'ua', value: 'Тканина Кордура' },
        { lang: 'en', value: 'Cordura fabric' },
      ],
      availableCount: 777,
      additions: [
        {
          available: true,
          name: [
            { lang: 'uk', value: 'Кишеня' },
            { lang: 'en', value: 'Pocket' },
          ],
          description: [
            { lang: 'uk', value: 'Бокова кишенька за бажанням' },
            { lang: 'en', value: 'Side pocket by request' },
          ],
          additionalPrice: [
            { currency: 'UAH', value: 145000 },
            { currency: 'USD', value: 5229 },
          ],
        },
      ],
    },
  ],
};

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
    expect(allProducts).toMatchSnapshot();
  });
  test('#2 Should receive product by ID', async () => {
    const product = await client.query({
      query: gql`
        query($id: ID!) {
          getProductById(id: $id) {
            ... on Product {
              _id
              name {
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
      { __typename: 'Language', value: 'Very Coool Baggy' },
      { __typename: 'Language', value: 'ДУЖЕ СУПЕРСЬКИЙ Рюкзачечок' },
    ]);
    expect(resultProduct).toHaveProperty('description', [
      { __typename: 'Language', value: 'Baggy is so cool' },
      { __typename: 'Language', value: 'Рюкзачечок - супер кльовий))' },
    ]);
    expect(resultProduct).toHaveProperty('category', {
      __typename: 'Category',
      _id: 'ddc81f5dbac48c38d0403dd3',
    });
    expect(resultProduct).toHaveProperty('subcategory', {
      __typename: 'Category',
      _id: '688ded7be0c2621f2fb17b05',
    });
    expect(resultProduct).toHaveProperty('mainMaterial', [
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
    expect(resultProduct).toHaveProperty('innerMaterial', [
      {
        __typename: 'Language',
        value: 'Oxford 135',
      },
      {
        __typename: 'Language',
        value: 'Oxford 135',
      },
    ]);
    expect(resultProduct).toHaveProperty('strapLengthInCm', 100);
    expect(resultProduct).toHaveProperty('pattern', [
      {
        __typename: 'Language',
        value: 'Вишивка',
      },
      {
        __typename: 'Language',
        value: 'Embroidery',
      },
    ]);
    expect(resultProduct).toHaveProperty('closureColor', 'black');
    expect(resultProduct).toHaveProperty('basePrice', [
      {
        __typename: 'CurrencySet',
        value: 145000,
      },
      {
        __typename: 'CurrencySet',
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
