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
            available
            code
          }
          ... on Error {
            message
            statusCode
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
const updateCategory = async (id, category, operations) => {
  const updatedCategory = await operations.mutate({
    mutation: gql`
      mutation($id: ID!, $category: CategoryInput!, $upload: Upload) {
        updateCategory(id: $id, category: $category, upload: $upload) {
          ... on Category {
            _id
            name {
              lang
              value
            }
            available
            code
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
      category,
      upload: '../___test__/model/dog.img',
    },
  });

  return updatedCategory.data.updateCategory;
};
const getAllCategories = async operations => {
  const allCategories = await operations.query({
    query: gql`
      query {
        getAllCategories {
          _id
          name {
            lang
            value
          }
          code
          available
        }
      }
    `,
  });

  return allCategories.data.getAllCategories;
};
const getCategoryById = async (id, operations) => {
  const categoryById = await operations.query({
    query: gql`
      query($id: ID!) {
        getCategoryById(id: $id) {
          ... on Category {
            _id
            name {
              lang
              value
            }
            code
            available
          }
          ... on Error {
            message
            statusCode
          }
        }
      }
    `,
    variables: { id },
  });

  return categoryById.data.getCategoryById;
};
const deleteCategory = async (id, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        deleteCategory(deleteId: $id, switchId: $id) {
          ... on Category {
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
  return res.data.deleteCategory;
};

module.exports = {
  deleteCategory,
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
};
