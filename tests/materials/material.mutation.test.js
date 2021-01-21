/* eslint-disable no-undef */
const { gql } = require('@apollo/client');
const {
  MATERIAL_ALREADY_EXIST,
  MATERIAL_NOT_FOUND,
} = require('../../error-messages/material.messages');
const {
  materialDoesNotExistId,
  createColor,
  getMaterialForMutation,
  color,
  getMaterialToUpdate,
} = require('./material.variables');

const { setupApp } = require('../helper-functions');
jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.model.js');
jest.mock('../../modules/currency/currency.utils.js');

let operations;
let materialId = '';
let colorId;
let material;
let materialToUpdate;

describe('material mutations tests', () => {
  beforeAll(async () => {
    operations = await setupApp();
    colorId = await createColor(color);
    material = getMaterialForMutation(colorId);
    materialToUpdate = getMaterialToUpdate(colorId);
  });
  afterAll(async () => {
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
    return { deleteColor };
  });

  it('should add material to database', async () => {
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
                _id
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
        _id: colorId,
      },
    ]);
    expect(addedMaterial.colors).toBeInstanceOf(Array);
  });

  it('should return error when adding material with the existing name', async () => {
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
                _id
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
                _id
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
        _id: colorId,
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
                _id
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
