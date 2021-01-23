/* eslint-disable no-undef */
const {
  newCategoryInputData,
  newOrderInputData,
  newColorInputData,
  newMaterialInputData,
  newModelInputData,
  newProductInputData,
  newSizeInputData,
  switchId,
} = require('./order.variables');

const {
  createColor,
  createMaterial,
  createCategory,
  createModel,
  createProduct,
  createSize,
  createOrder,
  deleteColor,
  deleteMaterial,
  deleteCategory,
  deleteModel,
  deleteProduct,
  deleteSize,
  deleteOrder,
  getAllOrders,
} = require('./order.helpers');
const { setupApp } = require('../helper-functions');

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/currency/currency.model.js');
jest.mock('../../modules/delivery/delivery.service.js');

let colorId;
let sizeId;
let productId;
let orderId;
let modelId;
let operations;
let materialId;
let categoryId;

describe('Order queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
    sizeId = await createSize(newSizeInputData, operations);
    colorId = await createColor(newColorInputData, operations);
    categoryId = await createCategory(newCategoryInputData, operations);
    materialId = await createMaterial(
      newMaterialInputData(colorId),
      operations
    );
    modelId = await createModel(newModelInputData(categoryId), operations);
    productId = await createProduct(
      newProductInputData(categoryId, modelId, materialId, materialId, colorId),
      operations
    );
    orderId = await createOrder(
      newOrderInputData(productId, modelId, sizeId),
      operations
    );
  });
  test('Should receive all orders', async () => {
    const orders = await getAllOrders(operations);

    expect(orders).toBeDefined();
    expect(orders.length).toBeGreaterThan(0);
    expect(orders).toBeInstanceOf(Array);
    // expect(orders[0]).toHaveProperty('user', newOrder.user);
    // expect(orders[0]).toHaveProperty('category', newOrder.category);
    // expect(orders[0]).toHaveProperty('pattern', newOrder.pattern);
  });
});

// test('should recive order by id', async () => {
//   const res = await operations.query({
//     query: gql`
//       query($id: ID!) {
//         getOrderById(id: $id) {
//           ... on Order {
//             user {
//               email
//               lastName
//               firstName
//               phoneNumber
//               patronymicName
//             }
//             dateOfCreation
//             delivery {
//               sentOn
//               sentBy
//               byCourier
//               invoiceNumber
//               courierOffice
//             }
//             isPaid
//             status
//             address {
//               appartment
//               buildingNumber
//               region
//               street
//               city
//               country
//               zipcode
//             }
//             userComment
//             lastUpdatedDate
//             cancellationReason
//             adminComment
//             items {
//               bottomColor {
//                 lang
//                 value
//               }
//               closure {
//                 lang
//                 value
//               }
//               model {
//                 lang
//                 value
//               }
//               closureColor
//               size {
//                 widthInCm
//                 weightInKg
//                 heightInCm
//                 volumeInLiters
//                 depthInCm
//               }
//               additions {
//                 lang
//                 value
//               }
//               actualPrice {
//                 currency
//                 value
//               }
//               name {
//                 lang
//                 value
//               }
//               pattern {
//                 lang
//                 value
//               }
//               category {
//                 lang
//                 value
//               }
//               quantity
//               colors {
//                 lang
//                 value
//               }
//               subcategory {
//                 lang
//                 value
//               }
//               bottomMaterial {
//                 lang
//                 value
//               }
//             }
//             totalItemsPrice {
//               currency
//               value
//             }
//             totalPriceToPay {
//               currency
//               value
//             }
//             paymentMethod
//           }
//           ... on Error {
//             statusCode
//             message
//           }
//         }
//       }
//     `,
//     variables: {
//       id: orderId,
//     },
//   });
//   const order = res.data.getOrderById;
//
//   expect(order).toBeDefined();
//   expect(order).toHaveProperty('status', 'DELIVERED');
//   expect(order).toHaveProperty('user', newOrder.user);
//   expect(order).toHaveProperty('address', newOrder.address);
//   expect(order).toHaveProperty('delivery', deliveryOrder);
//   expect(order).toHaveProperty('items', newOrder.items);
//   expect(order).toHaveProperty('paymentMethod', 'CARD');
//   expect(order).toHaveProperty('totalItemsPrice');
//   expect(order).toHaveProperty('totalPriceToPay');
// });

// test('Should throw error ORDER_NOT_FOUND', async () => {
//   const res = await operations
//     .query({
//       query: gql`
//         query($id: ID!) {
//           getOrderById(id: $id) {
//             ... on Order {
//               _id
//               user {
//                 email
//                 lastName
//                 firstName
//                 phoneNumber
//                 patronymicName
//               }
//               dateOfCreation
//               delivery {
//                 sentOn
//                 sentBy
//                 byCourier
//                 invoiceNumber
//                 courierOffice
//               }
//               isPaid
//               status
//               address {
//                 appartment
//                 buildingNumber
//                 region
//                 street
//                 city
//                 country
//                 zipcode
//               }
//               userComment
//               lastUpdatedDate
//               cancellationReason
//               adminComment
//               items {
//                 bottomColor {
//                   lang
//                   value
//                 }
//                 closure {
//                   lang
//                   value
//                 }
//                 model {
//                   lang
//                   value
//                 }
//                 closureColor
//                 size {
//                   widthInCm
//                   weightInKg
//                   heightInCm
//                   volumeInLiters
//                   depthInCm
//                 }
//                 additions {
//                   lang
//                   value
//                 }
//                 actualPrice {
//                   currency
//                   value
//                 }
//                 name {
//                   lang
//                   value
//                 }
//                 pattern {
//                   lang
//                   value
//                 }
//                 category {
//                   lang
//                   value
//                 }
//                 quantity
//                 colors {
//                   lang
//                   value
//                 }
//                 subcategory {
//                   lang
//                   value
//                 }
//                 bottomMaterial {
//                   lang
//                   value
//                 }
//               }
//               totalItemsPrice {
//                 currency
//                 value
//               }
//               totalPriceToPay {
//                 currency
//                 value
//               }
//               paymentMethod
//             }
//             ... on Error {
//               statusCode
//               message
//             }
//           }
//         }
//       `,
//       variables: {
//         id: '5f46a8ac90e86913ed0a95d8',
//       },
//     })
//     .catch(err => err);
//
//   const error = res;
//   expect(error.errors[0].message).toEqual('ORDER_NOT_FOUND');
// });

afterAll(async () => {
  operations = await setupApp();

  await deleteOrder(orderId, operations);
  await deleteModel(modelId, operations);
  await deleteCategory(categoryId, switchId, operations);
  await deleteProduct(productId, operations);
  await deleteMaterial(materialId, operations);
  await deleteColor(colorId, operations);
  await deleteSize(sizeId, operations);
});
