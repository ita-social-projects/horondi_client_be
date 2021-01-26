const { gql } = require('@apollo/client');

const createMaterial = async (material, operations) => {
  const createdMaterial = await operations.mutate({
    mutation: gql`
      mutation($material: MaterialInput!) {
        addMaterial(material: $material) {
          ... on Material {
            _id
          }
          ... on Error {
            message
          }
        }
      }
    `,
    variables: { material },
  });

  return createdMaterial.data.addMaterial._id;
};

const getAllMaterials = async operations => {
  const allMaterials = await operations.query({
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

  return allMaterials.data.getAllMaterials;
};
const getAllMaterialsWithSkipAndLimit = async (skip, limit, operations) => {
  return await operations.query({
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
};
const getMaterialById = async (id, operations) => {
  return await operations.query({
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
    variables: { id },
  });
};
const testCreateMaterial = async (material, operations) => {
  const testCreatedMaterial = await operations.mutate({
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

  return testCreatedMaterial.data.addMaterial;
};

const updateMaterial = async (id, material, operations) => {
  const updatedMaterial = await operations.mutate({
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
      id,
      material,
    },
  });

  return updatedMaterial.data.updateMaterial;
};

const deleteMaterial = async (id, operations) => {
  return await operations.mutate({
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
    variables: {
      id,
    },
  });
};

module.exports = {
  deleteMaterial,
  createMaterial,
  getAllMaterials,
  getMaterialById,
  getAllMaterialsWithSkipAndLimit,
  testCreateMaterial,
  updateMaterial,
};
