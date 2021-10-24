const { gql } = require('@apollo/client');

const addProductToWishlist = async (productId, operations) => {
  const wishlist = await operations.mutate({
    mutation: gql`
      mutation($productId: ID!) {
        addProductToWishlist(productId: $productId) {
          ... on Wishlist {
            _id
            user_id
          }
          ... on Error {
            statusCode
            message
          }
        }
      }
    `,
    variables: {
      productId,
    },
  });

  return wishlist.data.addProductToWishlist;
};

const deleteProductFromWishlist = async (productId, operations) => {
  const wishlist = await operations.mutate({
    mutation: gql`
      mutation($productId: ID!) {
        deleteProductFromWishlist(productId: $productId) {
          ... on Wishlist {
            _id
            user_id
            products {
              _id
            }
          }
          ... on Error {
            statusCode
            message
          }
        }
      }
    `,
    variables: {
      productId,
    },
  });

  return wishlist.data.deleteProductFromWishlist;
};

const getWishlistByUserId = async operations => {
  const wishlist = await operations.query({
    query: gql`
      query {
        getWishlistByUserId {
          ... on Wishlist {
            _id
            user_id
          }
          ... on Error {
            statusCode
            message
          }
        }
      }
    `,
  });

  return wishlist.data.getWishlistByUserId;
};

module.exports = {
  addProductToWishlist,
  deleteProductFromWishlist,
  getWishlistByUserId,
};
