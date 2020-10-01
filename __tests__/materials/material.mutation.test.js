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
  materialWithExistingName,
} = require('./material.variables');

const { setupApp } = require('../helper-functions');
jest.mock('../../modules/upload/upload.service');

let operations;
let materialId = '';

describe('material mutations tests', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });

  it('#1 should add material to database', async () => {
    const res = await operations.mutate({
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
      variables: { material },
    });

    const addedMaterial = res.data.addMaterial;
    materialId = res.data.addMaterial._id;
    expect(addedMaterial).toBeDefined();

    expect(addedMaterial).toHaveProperty(
      'name',
      material.name.map(item => ({
        ...item,
      }))
    );
    expect(addedMaterial.name).toBeInstanceOf(Array);

    expect(addedMaterial).toHaveProperty(
      'description',
      material.description.map(item => ({
        ...item,
      }))
    );
    expect(addedMaterial.description).toBeInstanceOf(Array);

    expect(addedMaterial).toHaveProperty('purpose', material.purpose);
    expect(addedMaterial).toHaveProperty('available', material.available);

    expect(addedMaterial).toHaveProperty(
      'additionalPrice',
      material.additionalPrice.map(item => ({
        ...item,
      }))
    );
    expect(addedMaterial.additionalPrice).toBeInstanceOf(Array);

    expect(addedMaterial).toHaveProperty('colors', [
      {
        code: 777,
        name: material.colors[0].name.map(item => ({
          ...item,
        })),
        simpleName: material.colors[0].simpleName.map(item => ({
          ...item,
        })),
        available: true,
        images: {
          large: 'large_test',
          medium: 'medium_test',
          small: 'small_test',
          thumbnail: 'thumbnail_test',
        },
      },
    ]);
    expect(addedMaterial.colors).toBeInstanceOf(Array);
  });

  it('#2 should return error when adding material with the existing name', async () => {
    const res = await operations.mutate({
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
      variables: { material },
    });

    const newMaterial = res.data.addMaterial;
    expect(newMaterial).toHaveProperty('message', MATERIAL_ALREADY_EXIST);
    expect(newMaterial).toHaveProperty('statusCode', 400);
  });

  it('#3 should update material', async () => {
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
    expect(updatedMaterial).toHaveProperty(
      'name',
      materialToUpdate.name.map(item => ({
        ...item,
      }))
    );
    expect(updatedMaterial.name).toBeInstanceOf(Array);

    expect(updatedMaterial).toHaveProperty(
      'description',
      materialToUpdate.description.map(item => ({
        ...item,
      }))
    );
    expect(updatedMaterial.name).toBeInstanceOf(Array);

    expect(updatedMaterial).toHaveProperty('purpose', materialToUpdate.purpose);
    expect(updatedMaterial).toHaveProperty(
      'available',
      materialToUpdate.available
    );
    expect(updatedMaterial).toHaveProperty(
      'additionalPrice',
      materialToUpdate.additionalPrice.map(item => ({
        ...item,
      }))
    );
    expect(updatedMaterial.name).toBeInstanceOf(Array);

    expect(updatedMaterial).toHaveProperty('colors', [
      {
        code: 777,
        name: materialToUpdate.colors[0].name.map(item => ({
          ...item,
        })),
        simpleName: materialToUpdate.colors[0].simpleName.map(item => ({
          ...item,
        })),
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

  it('#4 should return error when update not existing material should return error', async () => {
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

  it('#5 should return error when update material with already existing name will ', async () => {
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
      variables: { id: materialId, material: materialWithExistingName },
    });

    expect(res.data.updateMaterial).toHaveProperty('statusCode', 400);
    expect(res.data.updateMaterial).toHaveProperty(
      'message',
      MATERIAL_ALREADY_EXIST
    );
  });

  it('#6 should delete material', async () => {
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

  it('#7 should return error when delete not existing material ', async () => {
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
