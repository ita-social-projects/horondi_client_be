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
const getAllMaterialsBlocks = async operations => {
  const res = await operations.query({
    query: gql`
      query {
        getAllMaterialsBlocks {
          items {
            _id
            image
            text {
              lang
              value
            }
          }
        }
      }
    `,
  });

  return res.data.getAllMaterialsBlocks;
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
};
