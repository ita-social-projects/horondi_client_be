const { gql } = require('@apollo/client');

const addMaterialsBlock = async (materialsBlock, image, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation ($materialsBlock: MaterialsBlockInput!, $image: Upload!) {
        addMaterialsBlock(materialsBlock: $materialsBlock, image: $image) {
          ... on MaterialsBlock {
            _id
            text {
              lang
              value
            }
            image {
              medium
              small
            }
            title
            type
          }
        }
      }
    `,
    variables: {
      materialsBlock,
      image,
    },
  });

  return res.data.addMaterialsBlock;
};

const getAllMaterialsBlocks = async ({ skip, limit }, operations) => {
  const res = await operations.query({
    query: gql`
      query ($skip: Int!, $limit: Int!) {
        getAllMaterialsBlocks(skip: $skip, limit: $limit) {
          items {
            _id
            image {
              medium
              small
            }
            title
            type
            text {
              lang
              value
            }
            translationsKey
          }
        }
      }
    `,
    variables: {
      skip,
      limit,
    },
  });

  return res.data.getAllMaterialsBlocks;
};

const getMaterialsBlocksByType = async (
  { type, skip, limit, filter },
  operations
) => {
  const res = await operations.query({
    query: gql`
      query (
        $type: String!
        $skip: Int!
        $limit: Int!
        $filter: MaterialsFilterInput
      ) {
        getMaterialsBlocksByType(
          type: $type
          skip: $skip
          limit: $limit
          filter: $filter
        ) {
          items {
            _id
            image {
              medium
              small
            }
            title
            type
            text {
              lang
              value
            }
            translationsKey
          }
        }
      }
    `,
    variables: {
      skip,
      limit,
      type,
      filter,
    },
  });

  return res.data.getMaterialsBlocksByType;
};

const updateMaterialsBlock = async (id, materialsBlock, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation ($id: ID!, $materialsBlock: MaterialsBlockInput!) {
        updateMaterialsBlock(id: $id, materialsBlock: $materialsBlock) {
          ... on MaterialsBlock {
            _id
            image {
              medium
              small
            }
            title
            type
            text {
              lang
              value
            }
          }
        }
      }
    `,
    variables: {
      id,
      materialsBlock,
    },
  });

  return res.data.updateMaterialsBlock;
};

const getMaterialsBlockById = async (id, operations) => {
  const res = await operations.query({
    query: gql`
      query ($id: ID!) {
        getMaterialsBlockById(id: $id) {
          ... on MaterialsBlock {
            image {
              medium
              small
            }
            title
            type
            text {
              lang
              value
            }
          }
        }
      }
    `,
    variables: { id },
  });

  return res.data.getMaterialsBlockById;
};

const deleteMaterialsBlock = async (id, operations) =>
  operations.mutate({
    mutation: gql`
      mutation ($id: ID!) {
        deleteMaterialsBlock(id: $id) {
          ... on MaterialsBlock {
            _id
            text {
              lang
              value
            }
            image {
              medium
              small
            }
            title
            type
          }
        }
      }
    `,
    variables: { id },
  });

module.exports = {
  addMaterialsBlock,
  getAllMaterialsBlocks,
  deleteMaterialsBlock,
  getMaterialsBlockById,
  getMaterialsBlocksByType,
  updateMaterialsBlock,
};
