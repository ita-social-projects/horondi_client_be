const { gql } = require('@apollo/client');

const createMaterial = async (material, operations) => {
  const testCreatedMaterial = await operations.mutate({
    mutation: gql`
      mutation(
        $colors: [ID!]
        $available: Boolean
        $description: [LanguageInput]
        $name: [LanguageInput]
        $additionalPrice: additionalPriceInput!
      ) {
        addMaterial(
          material: {
            purpose: INNER
            colors: $colors
            available: $available
            description: $description
            name: $name
            additionalPrice: $additionalPrice
          }
        ) {
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
    variables: { ...material },
  });

  return testCreatedMaterial.data.addMaterial;
};
const getAllMaterials = async (operations) => {
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
const getAllMaterialsWithSkipAndLimit = async (skip, limit, operations) =>
  operations.query({
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
const getMaterialById = async (id, operations) =>
  operations.query({
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
const updateMaterial = async (id, material, operations) => {
  const updatedMaterial = await operations.mutate({
    mutation: gql`
      mutation(
        $id: ID!
        $colors: [ID!]
        $available: Boolean
        $description: [LanguageInput]
        $name: [LanguageInput]
        $additionalPrice: additionalPriceInput!
      ) {
        updateMaterial(
          id: $id
          material: {
            purpose: INNER
            colors: $colors
            available: $available
            description: $description
            name: $name
            additionalPrice: $additionalPrice
          }
        ) {
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
      ...material,
    },
  });

  return updatedMaterial.data.updateMaterial;
};
const deleteMaterial = async (id, operations) =>
  operations.mutate({
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

module.exports = {
  deleteMaterial,
  createMaterial,
  getAllMaterials,
  getMaterialById,
  getAllMaterialsWithSkipAndLimit,
  updateMaterial,
};
