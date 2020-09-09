/* eslint-disable object-curly-newline */
/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const client = require('../../utils/apollo-test-client');
const {
  MATERIAL_ALREADY_EXIST,
  MATERIAL_NOT_FOUND,
} = require('../../error-messages/material.messages');
const {
  user,
  material,
  materialToUpdate,
  materialWithExistingName,
} = require('./material.variables');
const { adminLogin } = require('../helper-functions');

let token;
let materialId;
const materialDoesNotExistId = '1f2ad410eb01783384e6111b';

describe('test material mutations', () => {
  beforeAll(async () => {
    token = await adminLogin(user);
  });
  test('#1 should add material to database', async () => {
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
                message
                statusCode
              }
            }
          }
        `,
      })
      .catch(e => e);
    const newMaterial = res.data.addMaterial;
    materialId = newMaterial._id;

    expect(newMaterial).toBeDefined();
    expect(newMaterial).toHaveProperty('name', [
      { __typename: 'Language', lang: 'uk', value: 'Тест mutation' },
      { __typename: 'Language', lang: 'en', value: 'Test mutation' },
    ]);
    expect(newMaterial.name).toBeInstanceOf(Array);

    expect(newMaterial).toHaveProperty('description', [
      {
        __typename: 'Language',
        lang: 'uk',
        value: 'Опис test',
      },
      {
        __typename: 'Language',
        lang: 'en',
        value: 'Description test',
      },
    ]);
    expect(newMaterial.description).toBeInstanceOf(Array);

    expect(newMaterial).toHaveProperty('purpose', 'test');

    expect(newMaterial).toHaveProperty('available', true);

    expect(newMaterial).toHaveProperty('additionalPrice', [
      { __typename: 'CurrencySet', currency: 'UAH', value: 0 },
      { __typename: 'CurrencySet', currency: 'USD', value: 0 },
    ]);
    expect(newMaterial.additionalPrice).toBeInstanceOf(Array);

    expect(newMaterial).toHaveProperty('colors', [
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
    expect(newMaterial.colors).toBeInstanceOf(Array);
  });
  test('#2 adding existing material should return error', async () => {
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
                message
                statusCode
              }
            }
          }
        `,
      })
      .catch(e => e);
    const newMaterial = res.data.addMaterial;
    expect(newMaterial).toHaveProperty('message', MATERIAL_ALREADY_EXIST);
    expect(newMaterial).toHaveProperty('statusCode', 400);
  });

  test('#3 update material', async () => {
    const res = await client
      .mutate({
        mutation: gql`
          mutation($id: ID!, $material: MaterialInput!) {
            updateMaterial(id: $id, material: $material) {
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
                message
              }
            }
          }
        `,
        context: { headers: { token } },
        variables: { id: materialId, material: materialToUpdate },
      })
      .catch(e => e);
    const updatedMaterial = res.data.updateMaterial;

    expect(updatedMaterial).toBeDefined();
    expect(updatedMaterial).toHaveProperty('name', [
      { __typename: 'Language', lang: 'uk', value: 'Тест update' },
      { __typename: 'Language', lang: 'en', value: 'Test update' },
    ]);
    expect(updatedMaterial.name).toBeInstanceOf(Array);
    expect(updatedMaterial).toHaveProperty('description', [
      { __typename: 'Language', lang: 'uk', value: 'Опис update' },
      { __typename: 'Language', lang: 'en', value: 'Description update' },
    ]);
    expect(updatedMaterial.name).toBeInstanceOf(Array);
    expect(updatedMaterial).toHaveProperty('purpose', 'test update');
    expect(updatedMaterial).toHaveProperty('available', true);
    expect(updatedMaterial).toHaveProperty('additionalPrice', [
      { __typename: 'CurrencySet', currency: 'UAH', value: 0 },
      { __typename: 'CurrencySet', currency: 'USD', value: 0 },
    ]);
    expect(updatedMaterial.name).toBeInstanceOf(Array);
    expect(updatedMaterial).toHaveProperty('colors', [
      {
        __typename: 'Color',
        code: 777,
        name: [
          {
            __typename: 'Language',
            lang: 'uk',
            value: 'Тестовий колір update',
          },
          { __typename: 'Language', lang: 'en', value: 'Test color update' },
        ],
        images: {
          __typename: 'ImageSet',
          large: 'large_test update',
          medium: 'medium_test update',
          small: 'small_test update',
          thumbnail: 'thumbnail_test update',
        },
        available: true,
        simpleName: [
          {
            __typename: 'Language',
            lang: 'uk',
            value: 'проста назва кольору update',
          },
          {
            __typename: 'Language',
            lang: 'en',
            value: 'simple color name update',
          },
        ],
      },
    ]);
    expect(updatedMaterial.name).toBeInstanceOf(Array);
  });
  test('#3 update not existing material should return error', async () => {
    const res = await client
      .mutate({
        mutation: gql`
          mutation($id: ID!, $material: MaterialInput!) {
            updateMaterial(id: $id, material: $material) {
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
                message
                statusCode
              }
            }
          }
        `,
        context: { headers: { token } },
        variables: { id: materialDoesNotExistId, material: materialToUpdate },
      })
      .catch(e => e);
    const updatedMaterial = res.data.updateMaterial;
    expect(updatedMaterial).toHaveProperty('statusCode', 404);
    expect(updatedMaterial).toHaveProperty('message', MATERIAL_NOT_FOUND);
  });
  test('#4 update material with already existing name will return error', async () => {
    const res = await client
      .mutate({
        mutation: gql`
          mutation($id: ID!, $material: MaterialInput!) {
            updateMaterial(id: $id, material: $material) {
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
        context: { headers: { token } },
        variables: { id: materialId, material: materialWithExistingName },
      })
      .catch(e => e);
    const updatedMaterial = res.data.updateMaterial;
    expect(updatedMaterial).toHaveProperty('statusCode', 400);
    expect(updatedMaterial).toHaveProperty('message', MATERIAL_ALREADY_EXIST);
  });
  test('#5 should delete material', async () => {
    const res = await client
      .mutate({
        mutation: gql`
          mutation($id: ID!) {
            deleteMaterial(id: $id) {
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
        context: { headers: { token } },
        variables: { id: materialId },
      })
      .catch(e => e);

    expect(res.data.deleteMaterial).toHaveProperty('_id', materialId);
  });
  test('#6 deleting not existing material should return error', async () => {
    const res = await client
      .mutate({
        mutation: gql`
          mutation($id: ID!) {
            deleteMaterial(id: $id) {
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
        context: { headers: { token } },
        variables: { id: materialDoesNotExistId },
      })
      .catch(e => e);
    const deletedMaterial = res.data.deleteMaterial;
    expect(deletedMaterial).toMatchSnapshot();
    expect(deletedMaterial).toHaveProperty('statusCode', 404);
    expect(deletedMaterial).toHaveProperty('message', MATERIAL_NOT_FOUND);
  });
});
