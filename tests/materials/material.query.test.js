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
jest.mock('../../modules/currency/currency.model.js');

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
  additionalPrice: 58,
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
          addMaterial(material: $material, images: []) {
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
        { lang: material.name[0].lang, value: material.name[0].value },
        { lang: material.name[1].lang, value: material.name[1].value },
      ],
      description: [
        {
          lang: material.description[0].lang,
          value: material.description[0].value,
        },
        {
          lang: material.description[1].lang,
          value: material.description[1].value,
        },
      ],
      purpose: material.purpose,
      available: material.available,
      colors: [
        {
          code: material.colors[0].code,
          name: [
            {
              lang: material.colors[0].name[0].lang,
              value: material.colors[0].name[0].value,
            },
            {
              lang: material.colors[0].name[1].lang,
              value: material.colors[0].name[1].value,
            },
          ],
          images: null,
          available: true,
          simpleName: [
            {
              lang: material.colors[0].simpleName[0].lang,
              value: material.colors[0].simpleName[0].value,
            },
            {
              lang: material.colors[0].simpleName[1].lang,
              value: material.colors[0].simpleName[1].value,
            },
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

    expect(receivedMaterial).toHaveProperty('colors', [
      {
        code: 777,
        name: material.colors[0].name,
        simpleName: material.colors[0].simpleName,
        available: true,
        images: null,
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

  it('Should receive 1 material', async () => {
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
              available
            }
            count
          }
        }
      `,
    });

    const { items, count } = res.data.getAllMaterials;
    expect(items).toHaveLength(1);
    expect(count).not.toBeNull();
    expect(count).toEqual(1);
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
    expect(items).toHaveLength(1);
    expect(count).toEqual(1);
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
    expect(items).toHaveLength(1);
    expect(count).toEqual(1);
    expect(items).not.toBeNull();
  });
});
