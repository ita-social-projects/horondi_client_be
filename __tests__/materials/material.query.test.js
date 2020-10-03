/* eslint-disable no-undef */
const { gql } = require('@apollo/client');
const {
  MATERIAL_NOT_FOUND,
} = require('../../error-messages/material.messages');

const {
  materialDoesNotExistId,
  graphqlErrorMessage,
  limit,
  skip,
  wrongSkip,
  wrongLimit,
  limitZero,
} = require('./material.variables');

const { setupApp } = require('../helper-functions');
jest.mock('../../modules/upload/upload.service');

let materialId = '';
let operations;

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

describe('material querries test', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });

  beforeAll(async () => {
    const res = await operations.mutate({
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
      variables: { material },
    });

    materialId = res.data.addMaterial._id;
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
  });

  it('should receive all materials', async () => {
    const res = await operations.query({
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
    });

    const getAllMaterials = res.data.getAllMaterials;
    expect(getAllMaterials).toBeDefined();
    expect(getAllMaterials.items).toBeInstanceOf(Array);
    expect(res.data.getAllMaterials.items).toContainEqual({
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
    });
  });

  it('should receive one material', async () => {
    const res = await operations.query({
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
    });

    const receivedMaterial = res.data.getMaterialById;
    expect(receivedMaterial).toBeDefined();
    expect(receivedMaterial).toMatchSnapshot();

    expect(receivedMaterial).toHaveProperty('name', material.name);
    expect(receivedMaterial.name).toBeInstanceOf(Array);

    expect(receivedMaterial).toHaveProperty(
      'description',
      material.description
    );
    expect(receivedMaterial.description).toBeInstanceOf(Array);

    expect(receivedMaterial).toHaveProperty('purpose', material.purpose);
    expect(receivedMaterial).toHaveProperty('available', material.available);

    expect(receivedMaterial).toHaveProperty(
      'additionalPrice',
      material.additionalPrice
    );
    expect(receivedMaterial.additionalPrice).toBeInstanceOf(Array);

    expect(receivedMaterial).toHaveProperty('colors', [
      {
        code: 777,
        name: material.colors[0].name,
        simpleName: material.colors[0].simpleName,
        available: true,
        images: {
          large: 'large_test',
          medium: 'medium_test',
          small: 'small_test',
          thumbnail: 'thumbnail_test',
        },
      },
    ]);
    expect(receivedMaterial.colors).toBeInstanceOf(Array);
  });

  it('should return error message when return not existing material', async () => {
    const res = await operations.query({
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
    });

    const receivedMaterial = res.data.getMaterialById;
    expect(receivedMaterial).toBeDefined();
    expect(receivedMaterial).toHaveProperty('statusCode', 404);
    expect(receivedMaterial).toHaveProperty('message', MATERIAL_NOT_FOUND);
  });

  it('Should receive 2 materials', async () => {
    const res = await operations.query({
      variables: { skip, limit },
      query: gql`
        query($skip: Int, $limit: Int) {
          getAllMaterials(skip: $skip, limit: $limit) {
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
            count
          }
        }
      `,
    });

    const { items, count } = res.data.getAllMaterials;
    expect(items).toHaveLength(2);
    expect(count).not.toBeNull();
    expect(count).toEqual(3);
  });

  it('should receive error if skip is negative', async () => {
    const res = await operations.query({
      variables: { skip: wrongSkip, limit },
      query: gql`
        query($skip: Int, $limit: Int) {
          getAllMaterials(skip: $skip, limit: $limit) {
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
            count
          }
        }
      `,
    });

    expect(res.errors[0].message).toEqual(graphqlErrorMessage);
  });

  it('should receive 3 materials if limit is -3', async () => {
    const res = await operations.query({
      query: gql`
        query($skip: Int, $limit: Int) {
          getAllMaterials(skip: $skip, limit: $limit) {
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
            count
          }
        }
      `,
      variables: { skip, limit: wrongLimit },
    });

    const { items, count } = res.data.getAllMaterials;
    expect(items).toHaveLength(3);
    expect(count).toEqual(3);
    expect(items).not.toBeNull();
  });

  it('should receive all materials if skip is 0 and limit is 0', async () => {
    const res = await operations.query({
      variables: { skip, limit: limitZero },
      query: gql`
        query($skip: Int, $limit: Int) {
          getAllMaterials(skip: $skip, limit: $limit) {
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
            count
          }
        }
      `,
    });

    const { items, count } = res.data.getAllMaterials;
    expect(items).toHaveLength(3);
    expect(count).toEqual(3);
    expect(items).not.toBeNull();
  });
});
