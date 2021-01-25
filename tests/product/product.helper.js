const { gql } = require('@apollo/client');

const createProduct = async (product, operations) => {
  const createdProduct = await operations.mutate({
    mutation: gql`
      mutation($product: ProductInput!) {
        addProduct(product: $product, upload: []) {
          ... on Product {
            _id
          }
          ... on Error {
            message
          }
        }
      }
    `,
    variables: {
      product,
    },
  });

  return createdProduct.data.addProduct._id;
};
const deleteProduct = async (id, operations) => {
  await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        deleteProduct(id: $id) {
          ... on Product {
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
  deleteProduct,
  createProduct,
};
