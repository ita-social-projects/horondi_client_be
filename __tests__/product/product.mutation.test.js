/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const client = require('../../utils/apollo-test-client');
require('dotenv').config();

let productId;
let sameNameProductId;
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

const productForUpdate = {
  category: 'ddc81f5dbac48c38d0403dd3',
  subcategory: '688ded7be0c2621f2fb17b05',
  name: [
    { lang: 'en', value: 'Bad Baggy' },
    { lang: 'ua', value: 'Жахливий Рюкзачечок' },
  ],
  description: [
    { lang: 'en', value: 'Baggy is so bad' },
    { lang: 'ua', value: 'Рюкзачечок - не добрий))' },
  ],
  mainMaterial: [
    {
      lang: 'uk',
      value: 'Canvas-400QQ прошита без спеціального матеріалу',
    },
    {
      lang: 'en',
      value: 'Canvas-400QQ padded without a layer water-resistant material',
    },
  ],
  innerMaterial: [
    { lang: 'uk', value: 'Oxford 115' },
    { lang: 'en', value: 'Oxford 115' },
  ],
  pattern: [
    { lang: 'uk', value: 'Вишивочка' },
    { lang: 'en', value: 'Embroidery' },
  ],
  patternImages: {
    large: 'large-embroidery.jpg',
    medium: 'medium-embroidery.jpg',
    thumbnail: 'thumbnail-embroidery.jpg',
  },
  strapLengthInCm: 90,
  closure: [
    { lang: 'uk', value: 'Фастекс (пластикова защіпка)' },
    { lang: 'en', value: 'Plastic closure' },
  ],
  closureColor: 'white',
  basePrice: [
    { currency: 'UAH', value: 777000 },
    { currency: 'USD', value: 7779 },
  ],
  available: false,
  isHotItem: true,
  images: {
    primary: {
      large: 'large-primary_15_1.jpg',
      medium: 'medium-primary_15_1.jpg',
      thumbnail: 'thumbnail-primary_15_1.jpg',
    },
    additional: [
      {
        large: 'large-additional_15_2.jpg',
        medium: 'medium-additional_15_2.jpg',
        small: 'small-additional_15_2.jpg',
        thumbnail: 'thumbnail-additional_15_2.jpg',
      },
      {
        large: 'large-additional_15.jpg',
        medium: 'medium-additional_15.jpg',
        thumbnail: 'thumbnail-additional_15.jpg',
      },
      {
        large: 'large-additional_15_2.jpg',
        medium: 'medium-additional_15_2.jpg',
        thumbnail: 'thumbnail-additional_15_2.jpg',
      },
    ],
  },
  colors: [
    {
      code: 206,
      name: [
        { lang: 'uk', value: 'Златий' },
        { lang: 'en', value: 'Goldy' },
      ],
      images: {
        large: 'large-golden.jpg',
        medium: 'medium-golden.jpg',
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
      size: '50288e8716e80d7569f64e2e',
      bottomMaterial: 'dadba32080da96e40847166d',
      description: [
        { lang: 'ua', value: 'Кордура' },
        { lang: 'en', value: 'Cordura' },
      ],
      availableCount: 50,
      additions: [
        {
          available: false,
          name: [
            { lang: 'uk', value: 'Кишеня' },
            { lang: 'en', value: 'Pocket' },
          ],
          description: [
            { lang: 'uk', value: 'Бокова кишенька' },
            { lang: 'en', value: 'Side pocket' },
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

const sameNameForUpdate = {
  category: 'ddc81f5dbac48c38d0403dd3',
  subcategory: '688ded7be0c2621f2fb17b05',
  description: [
    { lang: 'en', value: 'Baggy is so cool' },
    { lang: 'ua', value: 'Рюкзачечок - супер кльовий))' },
  ],
  name: [
    { lang: 'en', value: 'Baggy!!!' },
    { lang: 'ua', value: 'Рюкзачечок!!!!' },
  ],
  mainMaterial: [
    {
      lang: 'uk',
      value: 'Canvas-400B прошита додатковим шаром спеціального матеріалу',
    },
    {
      lang: 'en',
      value:
        'Canvas-400B padded with a layer of durable and water-resistant material',
    },
  ],
  innerMaterial: [
    { lang: 'uk', value: 'Oxford 135' },
    { lang: 'en', value: 'Oxford 135' },
  ],
  patternImages: {
    large: 'large-embroidery.jpg',
    medium: 'medium-embroidery.jpg',
    small: 'small-embroidery.jpg',
    thumbnail: 'thumbnail-embroidery.jpg',
  },
  pattern: [
    { lang: 'uk', value: 'Вишивка' },
    { lang: 'en', value: 'Embroidery' },
  ],
  strapLengthInCm: 1000,
  closure: [
    { lang: 'uk', value: 'Фастекс (пластик)' },
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
    primary: {
      large: 'large-primary_15.jpg',
      medium: 'medium-primary_15.jpg',
      small: 'small-primary_15.jpg',
      thumbnail: 'thumbnail-primary_15.jpg',
    },
  },
  colors: [
    {
      code: 206,
      name: [
        { lang: 'uk', value: 'Золото' },
        { lang: 'en', value: 'Gold' },
      ],
      available: true,
      simpleName: [
        { lang: 'uk', value: 'жовтий' },
        { lang: 'en', value: 'yelow' },
      ],
      images: {
        large: 'large-golden.jpg',
        medium: 'medium-golden.jpg',
        small: 'small-golden.jpg',
        thumbnail: 'thumbnail-golden.jpg',
      },
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
      availableCount: 7,
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

describe('Product mutations', () => {
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
      variables: { product: newProduct },
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
      _id: 'ddc81f5dbac48c38d0403dd3',
    });
    expect(createdProduct).toHaveProperty('subcategory', {
      __typename: 'Category',
      _id: '688ded7be0c2621f2fb17b05',
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
        product: productForUpdate,
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
      _id: 'ddc81f5dbac48c38d0403dd3',
    });
    expect(productAfterUpdate).toHaveProperty('subcategory', {
      __typename: 'Category',
      _id: '688ded7be0c2621f2fb17b05',
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
      _id: 'ddc81f5dbac48c38d0403dd3',
    });
    expect(result).toHaveProperty('subcategory', {
      __typename: 'Category',
      _id: '688ded7be0c2621f2fb17b05',
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
});
