/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const client = require('../../utils/apollo-test-client');
require('dotenv').config();
const {
  MATERIAL_NOT_FOUND,
} = require('../../error-messages/material.messages');

let token;
let materialId;
const materialDoesNotExistId = '5f311ec5f2983e390432a8c3';
const { user } = require('./material.variables');
const { adminLogin } = require('../helper-functions');

const material = {
  name: [
    { lang: 'uk', value: 'Тест' },
    { lang: 'en', value: 'Test' },
  ],
  description: [
    { lang: 'uk', value: 'Опис Тестового матеріальчика' },
    { lang: 'en', value: 'Description for Test Materialyy' },
  ],
  purpose: 'test',
  available: true,
  additionalPrice: [
    { currency: 'UAH', value: 0 },
    { currency: 'USD', value: 0 },
  ],
  colors: [
    {
      code: 777,
      name: [
        { lang: 'uk', value: 'Тестовий колір' },
        { lang: 'en', value: 'Test color' },
      ],
      images: {
        large: 'large_test',
        medium: 'medium_test',
        small: 'small_test',
        thumbnail: 'thumbnail_test',
      },
      available: true,
      simpleName: [
        { lang: 'uk', value: 'проста назва кольору' },
        { lang: 'en', value: 'simple color name' },
      ],
    },
  ],
};

describe('querries', () => {
  beforeAll(async () => {
    token = await adminLogin(user);

    const res = await client
      .mutate({
        context: {
          headers: {
            token,
          },
        },
        variables: { material },
        mutation: gql`
          mutation($material: MaterialInput!) {
            addMaterial(material: $material) {
              ... on Material {
                _id
              }
              ... on Error {
                message
                statusCode
              }
            }
          }
        `,
      })
      .catch(e => e);

    materialId = res.data.addMaterial._id;
  });

  test('#1 Should receive all materials', async () => {
    const res = await client
      .query({
        query: gql`
          query {
            getAllMaterials {
              items {
                name {
                  lang
                  value
                }
                description {
                  lang
                  value
                }
                purpose

                colors {
                  code
                  name {
                    lang
                    value
                  }
                  simpleName {
                    lang
                    value
                  }
                  available
                  images {
                    large
                    medium
                    small
                    thumbnail
                  }
                }
                additionalPrice {
                  currency
                  value
                }
                available
              }
            }
          }
        `,
      })
      .catch(e => e);
    expect(res.data.getAllMaterials).toBeDefined();
    expect(res.data.getAllMaterials.items).toContainEqual({
      __typename: 'Material',
      name: [
        { __typename: 'Language', lang: 'uk', value: 'Тест' },
        { __typename: 'Language', lang: 'en', value: 'Test' },
      ],
      description: [
        {
          __typename: 'Language',
          lang: 'uk',
          value: 'Опис Тестового матеріальчика',
        },
        {
          __typename: 'Language',
          lang: 'en',
          value: 'Description for Test Materialyy',
        },
      ],
      purpose: 'test',
      available: true,
      additionalPrice: [
        { __typename: 'CurrencySet', currency: 'UAH', value: 0 },
        { __typename: 'CurrencySet', currency: 'USD', value: 0 },
      ],
      colors: [
        {
          __typename: 'Color',
          code: 777,
          name: [
            { __typename: 'Language', lang: 'uk', value: 'Тестовий колір' },
            { __typename: 'Language', lang: 'en', value: 'Test color' },
          ],
          images: {
            __typename: 'ImageSet',
            large: 'large_test',
            medium: 'medium_test',
            small: 'small_test',
            thumbnail: 'thumbnail_test',
          },
          available: true,
          simpleName: [
            {
              __typename: 'Language',
              lang: 'uk',
              value: 'проста назва кольору',
            },
            { __typename: 'Language', lang: 'en', value: 'simple color name' },
          ],
        },
      ],
    });
  });

  test('#2 Should receive one material', async () => {
    const res = await client
      .query({
        query: gql`
          query($id: ID!) {
            getMaterialById(id: $id) {
              ... on Material {
                name {
                  lang
                  value
                }
                description {
                  lang
                  value
                }
                purpose

                colors {
                  code
                  name {
                    lang
                    value
                  }
                  simpleName {
                    lang
                    value
                  }
                  available
                  images {
                    large
                    medium
                    small
                    thumbnail
                  }
                }
                additionalPrice {
                  currency
                  value
                }
                available
              }
              ... on Error {
                statusCode
                message
              }
            }
          }
        `,
        variables: { id: materialId },
      })
      .catch(e => e);
    const receivedMaterial = res.data.getMaterialById;
    expect(receivedMaterial).toBeDefined();
    expect(receivedMaterial).toHaveProperty('name', [
      { __typename: 'Language', lang: 'uk', value: 'Тест' },
      { __typename: 'Language', lang: 'en', value: 'Test' },
    ]);
    expect(receivedMaterial.name).toBeInstanceOf(Array);

    expect(receivedMaterial).toHaveProperty('description', [
      {
        __typename: 'Language',
        lang: 'uk',
        value: 'Опис Тестового матеріальчика',
      },
      {
        __typename: 'Language',
        lang: 'en',
        value: 'Description for Test Materialyy',
      },
    ]);
    expect(receivedMaterial.description).toBeInstanceOf(Array);

    expect(receivedMaterial).toHaveProperty('purpose', 'test');

    expect(receivedMaterial).toHaveProperty('available', true);

    expect(receivedMaterial).toHaveProperty('additionalPrice', [
      { __typename: 'CurrencySet', currency: 'UAH', value: 0 },
      { __typename: 'CurrencySet', currency: 'USD', value: 0 },
    ]);
    expect(receivedMaterial.additionalPrice).toBeInstanceOf(Array);

    expect(receivedMaterial).toHaveProperty('colors', [
      {
        __typename: 'Color',
        code: 777,
        name: [
          { __typename: 'Language', lang: 'uk', value: 'Тестовий колір' },
          { __typename: 'Language', lang: 'en', value: 'Test color' },
        ],
        images: {
          __typename: 'ImageSet',
          large: 'large_test',
          medium: 'medium_test',
          small: 'small_test',
          thumbnail: 'thumbnail_test',
        },
        available: true,
        simpleName: [
          {
            __typename: 'Language',
            lang: 'uk',
            value: 'проста назва кольору',
          },
          { __typename: 'Language', lang: 'en', value: 'simple color name' },
        ],
      },
    ]);
    expect(receivedMaterial.colors).toBeInstanceOf(Array);
  });

  test('#3 Returning not existing material should return error message', async () => {
    const res = await client
      .query({
        query: gql`
          query($id: ID!) {
            getMaterialById(id: $id) {
              ... on Material {
                name {
                  lang
                  value
                }
                description {
                  lang
                  value
                }
                purpose

                colors {
                  code
                  name {
                    lang
                    value
                  }
                  simpleName {
                    lang
                    value
                  }
                  available
                  images {
                    large
                    medium
                    small
                    thumbnail
                  }
                }
                additionalPrice {
                  value
                }
                available
              }
              ... on Error {
                statusCode
                message
              }
            }
          }
        `,
        variables: { id: materialDoesNotExistId },
      })
      .catch(e => e);
    const receivedMaterial = res.data.getMaterialById;
    expect(receivedMaterial).toBeDefined();
    expect(receivedMaterial).toHaveProperty('statusCode', 404);
    expect(receivedMaterial).toHaveProperty('message', MATERIAL_NOT_FOUND);
  });
  afterAll(async () => {
    await client
      .mutate({
        context: { headers: { token } },
        variables: { id: materialId },
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
      })
      .catch(e => e);
  });
});
