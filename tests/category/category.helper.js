const { gql } = require('@apollo/client');

const createCategory = async (category, operations) => {
  const createdCategory = await operations.mutate({
    mutation: gql`
      mutation($category: CategoryInput!, $upload: Upload) {
        addCategory(category: $category, upload: $upload) {
          ... on Category {
            _id
            name {
              lang
              value
            }
          }
          ... on Error {
            message
          }
        }
      }
    `,
    variables: {
      category,
      upload: '../___test__/model/dog.img',
    },
  });

  return createdCategory.data.addCategory;
};
const deleteCategory = async (id, operations) => {
  await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        deleteCategory(deleteId: $id, switchId: $id) {
          ... on Category {
            _id
          }
          ... on Error {
            message
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
  deleteCategory,
  createCategory,
};
