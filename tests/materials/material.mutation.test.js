/* eslint-disable no-undef */
const { gql } = require('@apollo/client');
const {
  MATERIAL_ALREADY_EXIST,
  MATERIAL_NOT_FOUND,
} = require('../../error-messages/material.messages');
const {
  materialDoesNotExistId,
  material,
  materialToUpdate,
} = require('./material.variables');

const { setupApp } = require('../helper-functions');
jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.model.js');
jest.mock('../../modules/currency/currency.utils.js');

let operations;
let materialId = '';

describe('material mutations tests', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });

  it('should add material to database', async () => {
    const res = await operations.mutate({
      mutation: gql`
        mutation($material: MaterialInput!) {
          addMaterial(material: $material, images: []) {
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
              available
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

    const addedMaterial = res.data.addMaterial;
    materialId = res.data.addMaterial._id;
    expect(addedMaterial).toBeDefined();

    expect(addedMaterial).toHaveProperty('name', material.name);
    expect(addedMaterial.name).toBeInstanceOf(Array);

    expect(addedMaterial).toHaveProperty('description', material.description);
    expect(addedMaterial.description).toBeInstanceOf(Array);

    expect(addedMaterial).toHaveProperty('purpose', material.purpose);
    expect(addedMaterial).toHaveProperty('available', material.available);

    expect(addedMaterial).toHaveProperty('colors', [
      {
        code: 777,
        name: material.colors[0].name,
        simpleName: material.colors[0].simpleName,
        available: true,
        images: null,
      },
    ]);
    expect(addedMaterial.colors).toBeInstanceOf(Array);
  });

  it('should return error when adding material with the existing name', async () => {
    const res = await operations.mutate({
      mutation: gql`
        mutation($material: MaterialInput!) {
          addMaterial(material: $material, images: []) {
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
      variables: { material },
    });

    const newMaterial = res.data.addMaterial;
    expect(newMaterial).toHaveProperty('message', MATERIAL_ALREADY_EXIST);
    expect(newMaterial).toHaveProperty('statusCode', 400);
  });

  it('should update material', async () => {
    const res = await operations.mutate({
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
      variables: {
        id: materialId,
        material: materialToUpdate,
      },
    });
    const updatedMaterial = res.data.updateMaterial;

    expect(updatedMaterial).toBeDefined();
    expect(updatedMaterial).toHaveProperty('name', materialToUpdate.name);
    expect(updatedMaterial.name).toBeInstanceOf(Array);

    expect(updatedMaterial).toHaveProperty(
      'description',
      materialToUpdate.description
    );
    expect(updatedMaterial.name).toBeInstanceOf(Array);

    expect(updatedMaterial).toHaveProperty('purpose', materialToUpdate.purpose);
    expect(updatedMaterial).toHaveProperty(
      'available',
      materialToUpdate.available
    );
    expect(updatedMaterial.name).toBeInstanceOf(Array);

    expect(updatedMaterial).toHaveProperty('colors', [
      {
        code: 777,
        name: materialToUpdate.colors[0].name,
        simpleName: materialToUpdate.colors[0].simpleName,
        available: true,
        images: {
          large: 'large_test update',
          medium: 'medium_test update',
          small: 'small_test update',
          thumbnail: 'thumbnail_test update',
        },
      },
    ]);
    expect(updatedMaterial.colors).toBeInstanceOf(Array);
  });

  it('should return error when update not existing material should return error', async () => {
    const res = await operations.mutate({
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
      variables: {
        id: materialDoesNotExistId,
        material: materialToUpdate,
      },
    });
    const updatedMaterial = res.data.updateMaterial;
    expect(updatedMaterial).toHaveProperty('statusCode', 404);
    expect(updatedMaterial).toHaveProperty('message', MATERIAL_NOT_FOUND);
  });

  it('should return error when update material with already existing name will ', async () => {
    const res = await operations.mutate({
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
      variables: { id: materialId, material: materialToUpdate },
    });

    expect(res.data.updateMaterial).toHaveProperty('statusCode', 400);
    expect(res.data.updateMaterial).toHaveProperty(
      'message',
      MATERIAL_ALREADY_EXIST
    );
  });

  it('should delete material', async () => {
    const res = await operations.mutate({
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
      variables: { id: materialId },
    });

    expect(res.data.deleteMaterial).toHaveProperty('_id', materialId);
  });

  it('should return error when delete not existing material ', async () => {
    const res = await operations.mutate({
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
      variables: { id: materialDoesNotExistId },
    });

    expect(res.data.deleteMaterial).toHaveProperty('statusCode', 404);
    expect(res.data.deleteMaterial).toHaveProperty(
      'message',
      MATERIAL_NOT_FOUND
    );
  });
});
