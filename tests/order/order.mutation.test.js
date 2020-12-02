/* eslint-disable no-undef */
const { gql } = require('@apollo/client');
const {
  newOrderMutation,
  newOrderUpdated,
  newOrder,
} = require('./order.variables');
const { setupApp } = require('../helper-functions');
jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.model.js');
jest.mock('../../modules/delivery/delivery.service.js');
let operations;
let orderId = '';

describe('Order mutations', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });
  it('Should create order', async () => {
    const res = await operations.mutate({
      mutation: gql`
        mutation($order: OrderInput!) {
          addOrder(order: $order) {
            ... on Order {
              _id
              user {
                email
                lastName
                firstName
                phoneNumber
                patronymicName
              }
              dateOfCreation
              delivery {
                sentOn
                sentBy
                byCourier
                invoiceNumber
                courierOffice
              }
              isPaid
              status
              address {
                appartment
                buildingNumber
                region
                street
                city
                country
                zipcode
              }
              userComment
              lastUpdatedDate
              cancellationReason
              adminComment
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
                size {
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
              totalItemsPrice {
                currency
                value
              }
              totalPriceToPay {
                currency
                value
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
      variables: { order: newOrderMutation },
    });
    const order = res.data.addOrder;
    orderId = order._id;
    expect(order).toBeDefined();
    expect(order).toHaveProperty('status', 'SENT');
    expect(order).toHaveProperty('user', newOrder.user);
    expect(order).toHaveProperty('address', newOrder.address);
    expect(order).toHaveProperty('delivery', {
      byCourier: newOrder.delivery.byCourier,
      invoiceNumber: newOrder.delivery.invoiceNumber,
      courierOffice: newOrder.delivery.courierOffice,
      sentBy: newOrder.delivery.sentBy,
      sentOn: null,
    });
    expect(order).toHaveProperty('items', newOrder.items);
    expect(order).toHaveProperty('paymentMethod', newOrder.paymentMethod);
    expect(order).toHaveProperty('totalItemsPrice');
    expect(order).toHaveProperty('totalPriceToPay');
  });
  test('Should throw error ORDER_NOT_FOUND after try to delete', async () => {
    const res = await operations
      .mutate({
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
        variables: { id: '5f46a8ac90e86913ed0a95d8' },
      })
      .catch(err => err);

    const error = res;
    expect(error.errors[0].message).toEqual('ORDER_NOT_FOUND');
  });

  test('Should update order', async () => {
    const order = await operations.mutate({
      mutation: gql`
        mutation($order: OrderInput!) {
          updateOrder(order: $order) {
            ... on Order {
              _id
              user {
                email
                lastName
                firstName
                phoneNumber
                patronymicName
              }
              dateOfCreation
              delivery {
                sentBy
                byCourier
                invoiceNumber
                courierOffice
              }
              isPaid
              status
              address {
                appartment
                buildingNumber
                region
                street
                city
                country
                zipcode
              }
              userComment
              lastUpdatedDate
              cancellationReason
              adminComment
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
                size {
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
              totalItemsPrice {
                currency
                value
              }
              totalPriceToPay {
                currency
                value
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
      variables: { order: { _id: orderId, ...newOrderUpdated } },
    });
    const updatedOrder = order.data.updateOrder;

    expect(updatedOrder).toBeDefined();
    expect(updatedOrder).toBeDefined();
    expect(updatedOrder).toHaveProperty('status', newOrderUpdated.status);
    expect(updatedOrder).toHaveProperty('user', newOrderUpdated.user);
    expect(updatedOrder).toHaveProperty('address', newOrderUpdated.address);
    expect(updatedOrder).toHaveProperty('delivery', {
      byCourier: newOrder.delivery.byCourier,
      invoiceNumber: newOrder.delivery.invoiceNumber,
      courierOffice: newOrder.delivery.courierOffice,
      sentBy: newOrder.delivery.sentBy,
    });
    expect(updatedOrder).toHaveProperty('items', newOrderUpdated.items);
    expect(updatedOrder).toHaveProperty(
      'paymentMethod',
      newOrderUpdated.paymentMethod
    );
    expect(updatedOrder).toHaveProperty('totalItemsPrice');
    expect(updatedOrder).toHaveProperty('totalPriceToPay');
  });

  test('Should throw error ORDER_NOT_FOUND after try to update', async () => {
    const res = await operations
      .mutate({
        mutation: gql`
          mutation($order: OrderInput!) {
            updateOrder(order: $order) {
              ... on Order {
                _id
                user {
                  email
                  lastName
                  firstName
                  phoneNumber
                  patronymicName
                }
                dateOfCreation
                delivery {
                  sentOn
                  sentBy
                  byCourier
                  invoiceNumber
                  courierOffice
                }
                isPaid
                status
                address {
                  appartment
                  buildingNumber
                  region
                  street
                  city
                  country
                  zipcode
                }
                userComment
                lastUpdatedDate
                cancellationReason
                adminComment
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
                  size {
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
                totalItemsPrice {
                  currency
                  value
                }
                totalPriceToPay {
                  currency
                  value
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
        variables: {
          order: { _id: '5f46a8ac90e86913ed0a95d8', ...newOrderUpdated },
        },
      })
      .catch(err => err);

    const error = res;
    expect(error.data.updateOrder.message).toBe('ORDER_NOT_FOUND');
  });

  test('Should delete order', async () => {
    const deleteOrder = await operations.mutate({
      mutation: gql`
        mutation($id: ID!) {
          deleteOrder(id: $id) {
            ... on Order {
              _id
              user {
                email
                lastName
                firstName
                phoneNumber
                patronymicName
              }
              dateOfCreation
              delivery {
                sentOn
                sentBy
                byCourier
                invoiceNumber
                courierOffice
              }
              isPaid
              status
              address {
                appartment
                buildingNumber
                region
                street
                city
                country
                zipcode
              }
              userComment
              lastUpdatedDate
              cancellationReason
              adminComment
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
                size {
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
              totalItemsPrice {
                currency
                value
              }
              totalPriceToPay {
                currency
                value
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
    expect(orderDelete).toBeDefined();
    expect(orderDelete).toHaveProperty('status', newOrderUpdated.status);
    expect(orderDelete).toHaveProperty('user', newOrderUpdated.user);
    expect(orderDelete).toHaveProperty('address', newOrderUpdated.address);
    expect(orderDelete).toHaveProperty('delivery', {
      byCourier: newOrderUpdated.delivery.byCourier,
      invoiceNumber: newOrderUpdated.delivery.invoiceNumber,
      courierOffice: newOrderUpdated.delivery.courierOffice,
      sentBy: newOrderUpdated.delivery.sentBy,
      sentOn: null,
    });
    expect(orderDelete).toHaveProperty('items', newOrderUpdated.items);
    expect(orderDelete).toHaveProperty(
      'paymentMethod',
      newOrderUpdated.paymentMethod
    );
    expect(orderDelete).toHaveProperty('totalItemsPrice');
    expect(orderDelete).toHaveProperty('totalPriceToPay');
  });
});
