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
  createColor,
  color,
  getMaterial,
} = require('./material.variables');

const { setupApp } = require('../helper-functions');
jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.model.js');
jest.mock('../../modules/currency/currency.utils.js');
jest.setTimeout(10000);

let materialId = '';
let operations;
let colorId;
let material;

describe('material querries test', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });

  beforeAll(async () => {
    colorId = await createColor(color);
    material = getMaterial(colorId);
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

    await operations.mutate({
      mutation: gql`
        mutation($id: ID!) {
          deleteColor(id: $id) {
            ... on Color {
              _id
            }
            ... on Error {
              statusCode
              message
            }
          }
        }
      `,
      variables: { id: colorId },
    });
    return { deleteMaterial, deleteColor };
  });

  it('should receive all materials', async () => {
    const res = await operations.query({
      query: gql`
        query {
          getAllMaterials(filter: { colors: [] }) {
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
                _id
                name {
                  lang
                  value
                }
                simpleName {
                  lang
                  value
                }
                colorHex
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
          _id: colorId,
          ...color,
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
                _id
                name {
                  lang
                  value
                }
                simpleName {
                  lang
                  value
                }
                colorHex
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

    expect(receivedMaterial).toHaveProperty('name', material.name);
    expect(receivedMaterial.name).toBeInstanceOf(Array);

    expect(receivedMaterial).toHaveProperty(
      'description',
      material.description
    );
    expect(receivedMaterial.description).toBeInstanceOf(Array);

    expect(receivedMaterial).toHaveProperty('purpose', material.purpose);
    expect(receivedMaterial).toHaveProperty('available', material.available);

    expect(receivedMaterial).toHaveProperty('colors');
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
                _id
                name {
                  lang
                  value
                }
                simpleName {
                  lang
                  value
                }
                colorHex
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
          getAllMaterials(skip: $skip, limit: $limit, filter: { colors: [] }) {
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
                _id
                name {
                  lang
                  value
                }
                simpleName {
                  lang
                  value
                }
                colorHex
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
          getAllMaterials(skip: $skip, limit: $limit, filter: { colors: [] }) {
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
                _id
                name {
                  lang
                  value
                }
                simpleName {
                  lang
                  value
                }
                colorHex
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
          getAllMaterials(skip: $skip, limit: $limit, filter: { colors: [] }) {
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
              additionalPrice {
                currency
                value
              }
              colors {
                _id
                name {
                  lang
                  value
                }
                simpleName {
                  lang
                  value
                }
                colorHex
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
          getAllMaterials(skip: $skip, limit: $limit, filter: { colors: [] }) {
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
                _id
                name {
                  lang
                  value
                }
                simpleName {
                  lang
                  value
                }
                colorHex
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
