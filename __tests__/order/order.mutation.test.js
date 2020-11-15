/* eslint-disable no-undef */
const { gql } = require('@apollo/client');
const { newOrderMutation, newOrderUpdated } = require('./order.variables');
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
    expect(order).toHaveProperty('user', {
      firstName: 'Test',
      lastName: 'Test',
      patronymicName: 'Test',
      email: 'test@gmail.com',
      phoneNumber: '380953544271',
    });
    expect(order).toHaveProperty('address', {
      country: 'Україна',
      region: 'Кіровоградська область',
      city: 'Новомиргород',
      zipcode: '98908',
      street: 'Бульвар Марії Приймаченко',
      buildingNumber: '25',
      appartment: '97',
    });
    expect(order).toHaveProperty('delivery', {
      sentBy: 'Nova Poshta',
      byCourier: true,
      courierOffice: 10,
      invoiceNumber: '6280260',
      sentOn: null,
    });
    expect(order).toHaveProperty('items', [
      {
        category: [
          {
            lang: 'uk',
            value: 'Сумки',
          },
          {
            lang: 'en',
            value: 'Bags',
          },
        ],
        subcategory: [
          {
            lang: 'uk',
            value: 'Сумки',
          },
          {
            lang: 'en',
            value: 'Bags',
          },
        ],
        model: [
          {
            lang: 'uk',
            value: 'Сумка з гобеленом',
          },
          {
            lang: 'en',
            value: 'Bag with a Pattern',
          },
        ],
        name: [
          {
            lang: 'uk',
            value: 'Сумка з гобеленом синя',
          },
          {
            lang: 'en',
            value: 'Bag with a Pattern Blue',
          },
        ],
        colors: [
          [
            {
              lang: 'uk',
              value: 'Сталево-блакитний',
            },
            {
              lang: 'en',
              value: 'Steel-blue',
            },
          ],
        ],
        pattern: [
          {
            lang: 'uk',
            value: 'Олені',
          },
          {
            lang: 'en',
            value: 'Deers',
          },
        ],
        closure: [],
        closureColor: '',
        size: {
          heightInCm: 38,
          widthInCm: 36,
          depthInCm: 10,
          volumeInLiters: 0,
          weightInKg: 0,
        },
        bottomMaterial: [
          {
            lang: 'uk',
            value: 'Тканина Кордура',
          },
          {
            lang: 'en',
            value: 'Cordura fabric',
          },
        ],
        bottomColor: [
          {
            lang: 'uk',
            value: 'чорний',
          },
          {
            lang: 'en',
            value: 'black',
          },
        ],
        additions: [],
        actualPrice: [
          {
            currency: 'UAH',
            value: 90000,
          },
          {
            currency: 'USD',
            value: 3246,
          },
        ],
        quantity: 1,
      },
    ]);
    expect(order).toHaveProperty('paymentMethod', 'CARD');
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
    expect(updatedOrder).toHaveProperty('status', 'SENT');
    expect(updatedOrder).toHaveProperty('user', newOrderUpdated.user);
    expect(updatedOrder).toHaveProperty('address', newOrderUpdated.address);
    expect(updatedOrder).toHaveProperty('delivery', {
      byCourier: true,
      courierOffice: 10,
      invoiceNumber: '6280260',
      sentBy: 'Nova Poshta',
    });
    expect(updatedOrder).toHaveProperty('items', newOrderUpdated.items);
    expect(updatedOrder).toHaveProperty('paymentMethod', 'CARD');
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
    expect(orderDelete).toHaveProperty('status', 'SENT');
    expect(orderDelete).toHaveProperty('user', {
      firstName: 'Updated',
      lastName: 'Updated',
      email: 'test.updated@gmail.com',
      phoneNumber: '380953544271',
      patronymicName: 'Updated',
    });
    expect(orderDelete).toHaveProperty('address', {
      country: 'Україна',
      region: 'Кіровоградська область',
      city: 'Новомиргород',
      zipcode: '98908',
      street: 'Бульвар Марії Приймаченко',
      buildingNumber: '25',
      appartment: '97',
    });
    expect(orderDelete).toHaveProperty('delivery', {
      sentBy: 'Nova Poshta',
      byCourier: true,
      courierOffice: 10,
      invoiceNumber: '6280260',
      sentOn: null,
    });
    expect(orderDelete).toHaveProperty('items', [
      {
        category: [
          {
            lang: 'uk',
            value: 'Сумки',
          },
          {
            lang: 'en',
            value: 'Bags',
          },
        ],
        subcategory: [
          {
            lang: 'uk',
            value: 'Сумки',
          },
          {
            lang: 'en',
            value: 'Bags',
          },
        ],
        model: [
          {
            lang: 'uk',
            value: 'Сумка з гобеленом',
          },
          {
            lang: 'en',
            value: 'Bag with a Pattern',
          },
        ],
        name: [
          {
            lang: 'uk',
            value: 'Сумка з гобеленом синя',
          },
          {
            lang: 'en',
            value: 'Bag with a Pattern Blue',
          },
        ],
        colors: [
          [
            {
              lang: 'uk',
              value: 'Сталево-блакитний',
            },
            {
              lang: 'en',
              value: 'Steel-blue',
            },
          ],
        ],
        pattern: [
          {
            lang: 'uk',
            value: 'Олені',
          },
          {
            lang: 'en',
            value: 'Deers',
          },
        ],
        closure: [],
        closureColor: '',
        size: {
          heightInCm: 38,
          widthInCm: 36,
          depthInCm: 10,
          volumeInLiters: 0,
          weightInKg: 0,
        },
        bottomMaterial: [
          {
            lang: 'uk',
            value: 'Тканина Кордура',
          },
          {
            lang: 'en',
            value: 'Cordura fabric',
          },
        ],
        bottomColor: [
          {
            lang: 'uk',
            value: 'чорний',
          },
          {
            lang: 'en',
            value: 'black',
          },
        ],
        additions: [],
        actualPrice: [
          {
            currency: 'UAH',
            value: 90000,
          },
          {
            currency: 'USD',
            value: 3246,
          },
        ],
        quantity: 1,
      },
    ]);
    expect(orderDelete).toHaveProperty('paymentMethod', 'CARD');
    expect(orderDelete).toHaveProperty('totalItemsPrice');
    expect(orderDelete).toHaveProperty('totalPriceToPay');
  });
});
