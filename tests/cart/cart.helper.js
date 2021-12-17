const { gql } = require('@apollo/client');

const cartReqBody = `
items {
    _id
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
    allSizes {
    size {
        _id
        name
    }
    price {
      currency
      value
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
const addProductToCart = async (
  productId,
  adminId,
  sizeId,
  price,
  allSizes,
  operations,
) => {
  const res = await operations.mutate({
    mutation: gql`
        mutation($productId: ID!, $sizeId: ID!, $id:ID!, $price: [CurrencySetInput]!, $allSizes: [AllSizesInput!]) {
            addProductToCart(productId: $productId, sizeId: $sizeId, id:$id, price: $price, allSizes: $allSizes) {
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
      price,
      allSizes,
    },
  });

  return res.data.addProductToCart;
};
const changeCartItemSize = async (
  itemId,
  id,
  price,
  size,
  quantity,
  operations,
) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation($id:ID!, $itemId: ID!, $price: [CurrencySetInput]!, $size: ID!, $quantity: Int!) {
       changeCartItemSize(itemId: $itemId, size: $size, id:$id, price: $price, quantity: $quantity) {
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
      id,
      itemId,
      price,
      size,
      quantity,
    },
  });

  return res.data.changeCartItemSize;
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
const addConstructorProductItemToCart = async (
  productId,
  sizeId,
  constructorData,
  adminId,
  operations,
) => {
  const res = await operations.mutate({
    mutation: gql`
        mutation($productId: ID!, $sizeId: ID!, $constructorData: CartInput!, $id: ID!) {
          addConstructorProductItemToCart(productId: $productId, sizeId: $sizeId, constructorData: $constructorData, id:$id) {
                ... on User {
                    _id
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
      constructorData,
      id: adminId,
    },
  });
  return res.data.addConstructorProductItemToCart;
};
const updateCartConstructorProductItemQuantity = async (
  value,
  productId,
  sizeId,
  constructorData,
  adminId,
  operations,
) => {
  const res = await operations.mutate({
    mutation: gql`
        mutation($quantity: ID!, $productId: ID!, $sizeId: ID!, $constructorData: CartInput!, $id: ID!) {
          updateCartConstructorProductItemQuantity(quantity: $quantity, productId: $productId, sizeId: $sizeId, constructorData: $constructorData, id:$id) {
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
      quantity: value,
      productId,
      sizeId,
      constructorData,
      id: adminId,
    },
  });
  return res.data.updateCartConstructorProductItemQuantity;
};
const mergeCartFromLS = async (items, adminId, operations) => {
  const res = await operations.mutate({
    mutation: gql`
        mutation($items: [ CartFromLSInput!], $id:ID!) {
          mergeCartFromLS(items: $items, id:$id) {
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
  return res.data.mergeCartFromLS;
};

module.exports = {
  addProductToCart,
  removeProductItemsFromCart,
  cleanCart,
  updateCartItemQuantity,
  getCartByUserId,
  addConstructorProductItemToCart,
  updateCartConstructorProductItemQuantity,
  mergeCartFromLS,
  changeCartItemSize,
};
