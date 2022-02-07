const { gql } = require('@apollo/client');

const addMaterialsBlock = async (materialsBlock, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation($materialsBlock: MaterialsBlockInput!) {
        addMaterialsBlock(materialsBlock: $materialsBlock) {
          ... on MaterialsBlock {
            _id
            text {
              lang
              value
            }
            image
            title
            type
          }
        }
      }
    `,
    variables: {
      materialsBlock,
    },
  });
  return res.data.addMaterialsBlock;
};

const getAllMaterialsBlocks = async ({ skip, limit }, operations) => {
  const res = await operations.query({
    query: gql`
      query($skip: Int!, $limit: Int!) {
        getAllMaterialsBlocks(skip: $skip, limit: $limit) {
          items {
            _id
            image
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

const getMaterialsBlockById = async (id, operations) => {
  const res = await operations.query({
    query: gql`
      query($id: ID!) {
        getMaterialsBlockById(id: $id) {
          ... on MaterialsBlock {
            image
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
      mutation($id: ID!) {
        deleteMaterialsBlock(id: $id) {
          ... on MaterialsBlock {
            _id
            text {
              lang
              value
            }
            image
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
};
