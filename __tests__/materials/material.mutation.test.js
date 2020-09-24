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
  languageTypeName,
  imageTypeName,
  currencyTypeName,
} = require('./material.variables');
const { adminLogin } = require('../helper-functions');

let token;
let materialId;
const materialDoesNotExistId = '1f2ad410eb01783384e6111b';

describe('material mutations tests', () => {
  beforeAll(async () => {
    token = await adminLogin(user);
  });
  describe('test adding material', () => {
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
      expect(newMaterial).toHaveProperty(
        'name',
        material.name.map(item => ({ ...languageTypeName, ...item }))
      );
      expect(newMaterial.name).toBeInstanceOf(Array);

      expect(newMaterial).toHaveProperty(
        'description',
        material.description.map(item => ({ ...languageTypeName, ...item }))
      );
      expect(newMaterial.description).toBeInstanceOf(Array);

      expect(newMaterial).toHaveProperty('purpose', material.purpose);

      expect(newMaterial).toHaveProperty('available', material.available);

      expect(newMaterial).toHaveProperty(
        'additionalPrice',
        material.additionalPrice.map(item => ({
          ...currencyTypeName,
          ...item,
        }))
      );
      expect(newMaterial.additionalPrice).toBeInstanceOf(Array);

      expect(newMaterial).toHaveProperty('colors', [
        {
          __typename: 'Color',
          code: 777,
          name: material.colors[0].name.map(item => ({
            ...languageTypeName,
            ...item,
          })),
          images: { ...imageTypeName, ...material.colors[0].images },
          available: true,
          simpleName: material.colors[0].simpleName.map(item => ({
            ...languageTypeName,
            ...item,
          })),
        },
      ]);
      expect(newMaterial.colors).toBeInstanceOf(Array);
    });
    test('#2 adding material with the existing name should return error', async () => {
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
  });
  describe('update material tests', () => {
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
      expect(updatedMaterial).toHaveProperty(
        'name',
        materialToUpdate.name.map(item => ({ ...languageTypeName, ...item }))
      );
      expect(updatedMaterial.name).toBeInstanceOf(Array);
      expect(updatedMaterial).toHaveProperty(
        'description',
        materialToUpdate.description.map(item => ({
          ...languageTypeName,
          ...item,
        }))
      );
      expect(updatedMaterial.name).toBeInstanceOf(Array);
      expect(updatedMaterial).toHaveProperty(
        'purpose',
        materialToUpdate.purpose
      );
      expect(updatedMaterial).toHaveProperty(
        'available',
        materialToUpdate.available
      );
      expect(updatedMaterial).toHaveProperty(
        'additionalPrice',
        materialToUpdate.additionalPrice.map(item => ({
          ...currencyTypeName,
          ...item,
        }))
      );
      expect(updatedMaterial.name).toBeInstanceOf(Array);
      expect(updatedMaterial).toHaveProperty('colors', [
        {
          __typename: 'Color',
          code: 777,
          name: materialToUpdate.colors[0].name.map(item => ({
            ...languageTypeName,
            ...item,
          })),
          images: { ...imageTypeName, ...materialToUpdate.colors[0].images },
          available: true,
          simpleName: materialToUpdate.colors[0].simpleName.map(item => ({
            ...languageTypeName,
            ...item,
          })),
        },
      ]);
      expect(updatedMaterial.name).toBeInstanceOf(Array);
    });
    test('#4 update not existing material should return error', async () => {
      const res = await client
        .mutate({
          context: { headers: { token } },
          variables: { id: materialDoesNotExistId, material: materialToUpdate },
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
        })
        .catch(e => e);
      const updatedMaterial = res.data.updateMaterial;
      expect(updatedMaterial).toHaveProperty('statusCode', 404);
      expect(updatedMaterial).toHaveProperty('message', MATERIAL_NOT_FOUND);
    });
    test('#5 update material with already existing name will return error', async () => {
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
  });
  describe('delete material tests', () => {
    test('#6 should delete material', async () => {
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
    test('#7 deleting not existing material should return error', async () => {
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
});
