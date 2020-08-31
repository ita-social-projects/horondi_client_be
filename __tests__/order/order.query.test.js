/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const client = require('../../utils/apollo-test-client');
const { newOrder, orderResult } = require('./order.variables');

let orderId

describe('Order queries', () => {
  beforeAll(async () => {
    const createOrder = await client.mutate({
      mutation: gql`
        mutation($order: OrderInput!) {
          addOrder(order: $order) {
            ... on Order {
              _id
            }
          }
        }
      `,
      variables: { order: newOrder },
    });
    orderId = createOrder.data.addOrder._id;
  });

  test('Should receive all orders', async () => {
    const res = await client.query({
      query: gql`
        query {
          getAllOrders {
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
        }`
    })

    const orders = res.data.getAllOrders;

    expect(orders).toBeDefined();
    expect(orders.length).toBeGreaterThan(0);
    expect(orders).toBeInstanceOf(Array);
    expect(orders.find(order => order._id === orderId)).toMatchObject(orderResult);
  });

  test('should recive order by id', async () => {
    const res = await client.query({
      query: gql`
        query($id: ID!) {
          getOrderById(id: $id) {
            ...on Order {
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
        }`,
      variables: {
        id: orderId,
      },
    });

    const order = res.data.getOrderById

    expect(order).toMatchSnapshot()
    expect(order).toMatchObject(orderResult);
  });

  test('Should throw error ORDER_NOT_FOUND', async () => {
    const res = await client.query({
      query: gql`
        query($id: ID!) {
          getOrderById(id: $id) {
            ...on Order {
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
        }`,
      variables: {
        id: "5f46a8ac90e86913ed0a95d8",
      },
    }).catch(err => err)

    const error = res;

    expect(error.graphQLErrors[0].message).toBe("ORDER_NOT_FOUND");
  });

  afterAll(async () => {
    await client.mutate({
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
      variables: { id: orderId },
    });
  });
});
