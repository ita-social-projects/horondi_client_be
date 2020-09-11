/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const client = require('../../utils/apollo-test-client');
const { 
  newOrderMutation,
  newOrderUpdated,
  orderCreateResult,
  orderUpdateResult,
} = require('./order.variables');

let orderId

describe('Order mutations', () => {
  test('Should create order', async () => {
    const createOrder = await client.mutate({
      mutation: gql`
        mutation($order: OrderInput!) {
          addOrder(order: $order) {
            ...on Order {
              _id
              status
              totalPrice {
                currency
                value
              }
              user {
                address {
                  appartment
                  city
                  region
                  street
                  country
                  buildingNumber
                  zipcode
                }
                email
                lastName
                firstName
                phoneNumber
              }
              items {
                bottomColor {
                  lang
                  value
                }
                closure {
                  lang
                  value
                }
                model {
                  lang
                  value
                }
                closureColor 
                size{
                  widthInCm
                  weightInKg
                  heightInCm
                  volumeInLiters
                  depthInCm
                }
                additions {
                  lang
                  value
                }
                actualPrice {
                  currency
                  value
                }
                name {
                  lang
                  value
                }
                pattern {
                  lang
                  value
                }
                category {
                  lang
                  value
                }
                quantity
                colors {
                  lang
                  value
                }
                subcategory {
                  lang
                  value
                }
                bottomMaterial {
                  lang
                  value
                }
              }
              delivery {
                sentBy
                invoiceNumber
              }
              paymentMethod
            }
            ...on Error {
              statusCode
              message
            }
          }
        }
      `,
      variables: { order: newOrderMutation },
    });

    const order = createOrder.data.addOrder;
    orderId = order._id;
    
    expect(order).toMatchObject(orderCreateResult);
  });
  
  test('Should throw error ORDER_NOT_FOUND', async () => {
    const res = await client.mutate({
        mutation: gql`
          mutation($id: ID!) {
            deleteOrder(id: $id) {
              ... on Order {
                _id
              }
              ... on Error {
                statusCode
                message
              }
            }
          }
        `,
        variables: { id: "5f46a8ac90e86913ed0a95d8" },
      }).catch(err => err);


      const error = res;
      expect(error.graphQLErrors[0].message).toBe("ORDER_NOT_FOUND");
  });

  test('Should update order', async () => {
    const order = await client.mutate({
      mutation: gql`
        mutation($id: ID!, $order: OrderInput!) {
          updateOrder(id: $id, order: $order) {
            ...on Order {
              _id
              status
              totalPrice {
                currency
                value
              }
              user {
                address {
                  appartment
                  city
                  region
                  street
                  country
                  buildingNumber
                  zipcode
                }
                email
                lastName
                firstName
                phoneNumber
              }
              items {
                bottomColor {
                  lang
                  value
                }
                closure {
                  lang
                  value
                }
                model {
                  lang
                  value
                }
                closureColor 
                size{
                  widthInCm
                  weightInKg
                  heightInCm
                  volumeInLiters
                  depthInCm
                }
                additions {
                  lang
                  value
                }
                actualPrice {
                  currency
                  value
                }
                name {
                  lang
                  value
                }
                pattern {
                  lang
                  value
                }
                category {
                  lang
                  value
                }
                quantity
                colors {
                  lang
                  value
                }
                subcategory {
                  lang
                  value
                }
                bottomMaterial {
                  lang
                  value
                }
              }
              delivery {
                sentBy
                invoiceNumber
              }
              paymentMethod
            }
            ...on Error {
              statusCode
              message
            }
          }
        }
      `,
      variables: { order: newOrderUpdated, id: orderId },
    });

    const updatedOrder = order.data.updateOrder;
    
    expect(updatedOrder).toMatchObject(orderUpdateResult);
  });
  
  test('Should delete order', async () => {
    const deleteOrder =  await client.mutate({
        mutation: gql`
          mutation($id: ID!) {
            deleteOrder(id: $id) {
              ... on Order {
                _id
                status
                totalPrice {
                  currency
                  value
                }
                user {
                  address {
                    appartment
                    city
                    region
                    street
                    country
                    buildingNumber
                    zipcode
                  }
                  email
                  lastName
                  firstName
                  phoneNumber
                }
                items {
                  bottomColor {
                    lang
                    value
                  }
                  closure {
                    lang
                    value
                  }
                  model {
                    lang
                    value
                  }
                  closureColor 
                  size{
                    widthInCm
                    weightInKg
                    heightInCm
                    volumeInLiters
                    depthInCm
                  }
                  additions {
                    lang
                    value
                  }
                  actualPrice {
                    currency
                    value
                  }
                  name {
                    lang
                    value
                  }
                  pattern {
                    lang
                    value
                  }
                  category {
                    lang
                    value
                  }
                  quantity
                  colors {
                    lang
                    value
                  }
                  subcategory {
                    lang
                    value
                  }
                  bottomMaterial {
                    lang
                    value
                  }
                }
                delivery {
                  sentBy
                  invoiceNumber
                }
                paymentMethod
              }
              ... on Error {
                statusCode
                message
              }
            }
          }
        `,
        variables: { id: orderId },
      });

      const orderDelete = deleteOrder.data.deleteOrder;
    
    expect(orderDelete).toBeDefined();
    expect(orderDelete).toMatchObject(orderUpdateResult);
  });
});
