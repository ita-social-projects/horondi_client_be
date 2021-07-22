const { gql } = require('@apollo/client');

const cartReqBody = `
items {
    product {
        _id
        name {
            lang
            value
        }
        category{
        _id
        }
        bottomMaterial{
            material{
            name{
                lang
                value
            }
            }
        }
        mainMaterial{
        color{
            _id
            name{
            lang
            value
            }
        }
        }
        pattern{
        _id
        }
        images{
            primary{
            small
            thumbnail
            }
        }
    }
    quantity
    options {
    size {
        _id
        name
    }
    }
    price {
      currency
      value
    }
}
`;
const getCartByUserId = async (userId, operations) => {
  const res = await operations.query({
    query: gql`
        query($id:ID!){
            getCartByUserId(id: $id) {
            ... on User {
                cart {
                ${cartReqBody}
                totalPrice {
                    value
                }
                }
            }
            }
        }
        `,
    variables: {
      id: userId,
    },
  });
  return res.data.getCartByUserId;
};
const addProductToCart = async (productId, adminId, sizeId, operations) => {
  const res = await operations.mutate({
    mutation: gql`
        mutation($productId: ID!, $sizeId: ID!, $id:ID!) {
            addProductToCart(productId: $productId, sizeId: $sizeId, id:$id) {
                ... on User {
                    _id
                    firstName,
                    lastName,
                    email,
                    cart {
                        ${cartReqBody}
                        totalPrice{
                        currency
                        value
                        }
                    }
                }
                ... on Error {
                message
                statusCode
                }
            }
        }`,
    variables: {
      productId,
      sizeId,
      id: adminId,
    },
  });
  return res.data.addProductToCart;
};
const removeProductItemsFromCart = async (items, adminId, operations) => {
  const res = await operations.mutate({
    mutation: gql`
        mutation($items: RemoveItemsFromCartInput!, $id:ID!) {
            removeProductItemsFromCart(items: $items,id:$id) {
                ... on User {
                _id
                firstName
                cart {
                ${cartReqBody}
                    totalPrice{
                    currency
                    value
                    }
                }
                }
                ... on Error {
                    message
                    statusCode
                }
            }
        }`,
    variables: {
      items,
      id: adminId,
    },
  });
  return res.data.removeProductItemsFromCart;
};
const cleanCart = async (adminId, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        cleanCart(id: $id) {
          ... on User {
            _id
          }
          ... on Error {
            message
            statusCode
          }
        }
      }
    `,
    variables: { id: adminId },
  });
  return res.data.cleanCart;
};
const updateCartItemQuantity = async (items, value, adminId, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation($productId: ID!,$quantity:Int!, $sizeId: ID!, $id:ID!) {
        updateCartItemQuantity(productId: $productId,quantity:$quantity, sizeId: $sizeId,id:$id) {
          ... on User {
            _id
            firstName
            cart {
              ${cartReqBody}
              totalPrice{
                currency
                value
              }

            }
          }
        ... on Error {
          message
          statusCode
        }
        }
      }
    `,
    variables: {
      productId: items.product,
      quantity: value,
      sizeId: items.options.size,
      id: adminId,
    },
  });
  return res.data.updateCartItemQuantity;
};
module.exports = {
  addProductToCart,
  removeProductItemsFromCart,
  cleanCart,
  updateCartItemQuantity,
  getCartByUserId,
};
